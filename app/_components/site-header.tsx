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
    { href: "/contractor/jobs", label: "Job Board" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-ink-200 shadow-sm">
      <div className="container mx-auto">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex-shrink-0">
            <Logo size="md" showText={true} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-ink-700 hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                {link.label}
              </Link>
            ))}

            {/* Authentication */}
            {isSignedIn && user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'homeowner' && (
                  <>
                    <Link
                      href="/create-lead"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      Post Project
                    </Link>
                    <Link
                      href="/conversations"
                      className="text-ink-700 hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative inline-flex items-center"
                    >
                      Messages
                      <UnreadBadge count={unreadCount} className="ml-2" />
                    </Link>
                    <Link
                      href="/homeowner/quotes"
                      className="text-ink-700 hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      My Quotes
                    </Link>
                  </>
                )}
                {user.role === 'contractor' && (
                  <>
                    <Link
                      href="/contractor/jobs"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      View Jobs
                    </Link>
                    <Link
                      href="/conversations"
                      className="text-ink-700 hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative inline-flex items-center"
                    >
                      Messages
                      <UnreadBadge count={unreadCount} className="ml-2" />
                    </Link>
                    <Link
                      href="/contractor/quotes"
                      className="text-ink-700 hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Quotes
                    </Link>
                  </>
                )}
                <Link
                  href="/profile"
                  className="text-ink-700 hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Profile
                </Link>
                <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/demo-login"
                  className="text-ink-700 hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Demo Login
                </Link>
                <Link
                  href="/demo-login"
                  className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>

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
                  className="block text-ink-700 hover:text-[var(--brand)] py-2 text-base font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Auth */}
              {isSignedIn && user ? (
                <div className="space-y-3 pt-4 border-t border-ink-200">
                  {user.role === 'homeowner' && (
                    <>
                      <Link
                        href="/create-lead"
                        className="block bg-green-600 hover:bg-green-700 text-white text-center px-4 py-2 rounded-lg text-base font-medium transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Post Project
                      </Link>
                      <Link
                        href="/conversations"
                        className="flex items-center justify-between text-ink-700 hover:text-[var(--brand)] py-2 text-base font-medium transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span>Messages</span>
                        <UnreadBadge count={unreadCount} />
                      </Link>
                      <Link
                        href="/homeowner/quotes"
                        className="block text-ink-700 hover:text-[var(--brand)] py-2 text-base font-medium transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        My Quotes
                      </Link>
                    </>
                  )}
                  {user.role === 'contractor' && (
                    <>
                      <Link
                        href="/contractor/jobs"
                        className="block bg-blue-600 hover:bg-blue-700 text-white text-center px-4 py-2 rounded-lg text-base font-medium transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        View Jobs
                      </Link>
                      <Link
                        href="/conversations"
                        className="flex items-center justify-between text-ink-700 hover:text-[var(--brand)] py-2 text-base font-medium transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span>Messages</span>
                        <UnreadBadge count={unreadCount} />
                      </Link>
                      <Link
                        href="/contractor/quotes"
                        className="block text-ink-700 hover:text-[var(--brand)] py-2 text-base font-medium transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Quotes
                      </Link>
                    </>
                  )}
                  <Link
                    href="/profile"
                    className="block text-ink-700 hover:text-[var(--brand)] py-2 text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-4 border-t border-ink-200">
                  <Link
                    href="/demo-login"
                    className="block text-ink-700 hover:text-[var(--brand)] py-2 text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Demo Login
                  </Link>
                  <Link
                    href="/demo-login"
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
