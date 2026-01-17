"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useUnreadMessageCount } from "@/lib/hooks/useUnreadMessageCount";
import { UnreadBadge } from "./UnreadBadge";
import Logo from "@/components/Logo";

export default function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn, authUser: user } = useAuth();
  const { unreadCount } = useUnreadMessageCount();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/visualizer", label: "AI Visualizer", highlight: true },
    { href: "/blog", label: "Blog" },
    { href: "/affiliates", label: "Affiliates" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-white via-purple-50/30 to-pink-50/30 backdrop-blur-xl border-b-2 border-purple-200/50 shadow-xl">
      <div className="container mx-auto">
        <div className="flex justify-between items-center h-24 px-4">
          {/* Brand - BIGGER & MORE PROMINENT */}
          <div className="flex-shrink-0 transform transition-transform hover:scale-110">
            <Logo size="xl" showText={true} />
          </div>

          {/* Desktop Navigation - BIGGER & MORE MODERN */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${
                  link.highlight 
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white px-5 py-3 rounded-xl font-bold shadow-lg hover:shadow-2xl transform hover:scale-110 ring-2 ring-purple-400 ring-offset-2 text-base animate-pulse-glow' 
                    : 'text-gray-700 hover:text-purple-700 hover:bg-purple-50 px-4 py-3 rounded-xl font-semibold text-base'
                } transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2`}
              >
                {link.highlight && '✨ '}{link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions - BIGGER & MORE PROMINENT */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Authentication */}
            {isSignedIn && user ? (
              <>
                {/* Primary Action Button - BIGGER */}
                {user.role === 'homeowner' ? (
                  <Link
                    href="/create-lead"
                    className="bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white px-7 py-3.5 rounded-xl text-base font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 ring-2 ring-orange-400 ring-offset-2"
                  >
                    🏗️ Post Your Project
                  </Link>
                ) : (
                  <Link
                    href="/contractor/jobs"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-7 py-3.5 rounded-xl text-base font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 ring-2 ring-green-400 ring-offset-2"
                  >
                    💼 Find Jobs
                  </Link>
                )}

                {/* Messages with badge - BIGGER */}
                <Link
                  href="/messages"
                  className="text-gray-700 hover:text-purple-700 hover:bg-purple-50 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 relative inline-flex items-center"
                >
                  Messages
                  <UnreadBadge count={unreadCount} className="ml-2" />
                </Link>

                {/* Profile Menu - BIGGER */}
                <div className="flex items-center space-x-2">
                  <Link
                    href="/profile"
                    className="text-gray-700 hover:text-purple-700 hover:bg-purple-50 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200"
                  >
                    Profile
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-gray-700 hover:text-purple-700 hover:bg-purple-50 px-5 py-3 rounded-xl text-base font-semibold transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white px-8 py-3.5 rounded-xl text-base font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 ring-2 ring-purple-400 ring-offset-2"
                >
                  ✨ Get Started Free
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
          <div className="md:hidden bg-white border-t border-ink-200 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-2 text-base font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 rounded-md ${
                    link.highlight
                      ? 'bg-gradient-to-r from-rose-700 to-orange-600 text-white text-center px-4 py-3 rounded-lg font-bold shadow-lg'
                      : 'text-ink-700 hover:text-[var(--brand)]'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.highlight && '✨ '}{link.label}
                </Link>
              ))}

              {/* Mobile Auth */}
              {isSignedIn && user ? (
                <div className="space-y-3 pt-4 border-t border-ink-200">
                  {/* Primary Action */}
                  {user.role === 'homeowner' ? (
                    <Link
                      href="/create-lead"
                      className="block bg-gradient-to-r from-rose-700 to-orange-600 hover:from-rose-800 hover:to-orange-700 text-white text-center px-4 py-2 rounded-lg text-base font-medium transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Post Project
                    </Link>
                  ) : (
                    <Link
                      href="/contractor/jobs"
                      className="block bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-center px-4 py-3 rounded-lg text-base font-bold ring-2 ring-green-400 ring-offset-1 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      💼 Find Jobs
                    </Link>
                  )}
                  
                  {/* Messages */}
                  <Link
                    href="/messages"
                    className="flex items-center justify-between text-ink-700 hover:text-[var(--brand)] py-2 text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Messages</span>
                    <UnreadBadge count={unreadCount} />
                  </Link>
                  
                  {/* Profile */}
                  <Link
                    href="/profile"
                    className="block text-ink-700 hover:text-[var(--brand)] py-2 text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </div>
              ) : (
                <div className="space-y-3 pt-4 border-t border-ink-200">
                  <Link
                    href="/sign-in"
                    className="block text-ink-700 hover:text-[var(--brand)] py-2 text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="block w-full bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white text-center px-4 py-3 rounded-[var(--radius-button)] text-base font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
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
