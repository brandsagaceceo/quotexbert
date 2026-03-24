"use client";

import { useState, useEffect } from "react";

interface TourStep {
  title: string;
  description: string;
  emoji: string;
  // CSS selector to highlight — null means centre-screen (intro/outro)
  selector: string | null;
}

const HOMEOWNER_STEPS: TourStep[] = [
  {
    title: "Welcome to QuoteXbert! 🎉",
    description:
      "This quick tour shows you the key features of your profile. It only takes 30 seconds.",
    emoji: "👋",
    selector: null,
  },
  {
    title: "Your Profile Tabs",
    description:
      "Use these tabs to switch between your project overview, AI estimates, posted jobs, and messages.",
    emoji: "📑",
    selector: "[data-tour='profile-tabs']",
  },
  {
    title: "Edit Your Profile",
    description:
      "Tap the Edit button to update your name, city, and contact details so contractors can reach you.",
    emoji: "✏️",
    selector: "[data-tour='edit-profile-btn']",
  },
  {
    title: "Get an AI Estimate",
    description:
      "Head to the homepage, upload a photo of your project, and get an instant cost breakdown in 30 seconds.",
    emoji: "🤖",
    selector: "[data-tour='ai-estimate-link']",
  },
  {
    title: "Post a Job",
    description:
      "Once you have an estimate, post it as a job to receive bids from verified local contractors.",
    emoji: "📋",
    selector: "[data-tour='post-job-link']",
  },
  {
    title: "You're all set! 🚀",
    description:
      "Start by getting a free AI estimate on the homepage. Good luck with your project!",
    emoji: "✅",
    selector: null,
  },
];

const CONTRACTOR_STEPS: TourStep[] = [
  {
    title: "Welcome to QuoteXbert! 🎉",
    description:
      "This quick tour shows you the key features of your contractor profile. It only takes 30 seconds.",
    emoji: "👋",
    selector: null,
  },
  {
    title: "Your Profile Tabs",
    description:
      "Use these tabs to view your portfolio, accepted jobs, messages, and the live job board.",
    emoji: "📑",
    selector: "[data-tour='profile-tabs']",
  },
  {
    title: "Complete Your Profile",
    description:
      "Tap Edit to add your trade, company name, bio, and service radius. A complete profile gets more leads.",
    emoji: "✏️",
    selector: "[data-tour='edit-profile-btn']",
  },
  {
    title: "Browse Available Jobs",
    description:
      "Tap 'Browse Jobs' to see every open project in the GTA filtered to your trade and area.",
    emoji: "🔍",
    selector: "[data-tour='browse-jobs-link']",
  },
  {
    title: "Add to Your Portfolio",
    description:
      "Upload photos of past work under the Portfolio tab — homeowners use it to choose who to invite.",
    emoji: "🖼️",
    selector: "[data-tour='portfolio-tab']",
  },
  {
    title: "You're all set! 🚀",
    description:
      "Check the Jobs tab daily for new leads. The best contractors respond within the first hour!",
    emoji: "✅",
    selector: null,
  },
];

export default function OnboardingTour({ role }: { role: "homeowner" | "contractor" }) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);

  const steps = role === "contractor" ? CONTRACTOR_STEPS : HOMEOWNER_STEPS;
  const current = steps[step]!;
  const isLast = step === steps.length - 1;

  // Only show once per device
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("show_onboarding_tour") === "1") {
      // Small delay so the profile page renders first
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  // Update spotlight whenever step changes
  useEffect(() => {
    if (!visible || !current.selector) {
      setSpotlightRect(null);
      return;
    }
    const el = document.querySelector(current.selector) as HTMLElement | null;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      const t = setTimeout(() => {
        setSpotlightRect(el.getBoundingClientRect());
      }, 350);
      return () => clearTimeout(t);
    } else {
      setSpotlightRect(null);
    }
  }, [step, visible, current.selector]);

  const dismiss = () => {
    setVisible(false);
    localStorage.removeItem("show_onboarding_tour");
    localStorage.setItem("onboarding_tour_done", "1");
  };

  const next = () => {
    if (isLast) {
      dismiss();
    } else {
      setStep((s) => s + 1);
    }
  };

  if (!visible) return null;

  const PAD = 10; // px padding around spotlight
  const MOBILE_PADDING = 12; // px padding from edges on mobile
  const CARD_MIN_HEIGHT = 200; // Minimum card height for content

  // Calculate safe positioning that keeps card visible on mobile
  let cardTop = spotlightRect
    ? Math.min(
        spotlightRect.bottom + PAD + 16,
        window.innerHeight - CARD_MIN_HEIGHT - MOBILE_PADDING
      )
    : "50%";

  // Ensure card doesn't go above viewport on mobile
  if (typeof cardTop === 'number' && cardTop < MOBILE_PADDING) {
    cardTop = MOBILE_PADDING;
  }

  return (
    <>
      {/* Full-screen overlay */}
      <div
        className="fixed inset-0 z-[9000] transition-opacity duration-300"
        style={{ background: "rgba(0,0,0,0.60)" }}
        onClick={dismiss}
      >
        {/* Spotlight cutout (box-shadow trick) */}
        {spotlightRect && (
          <div
            className="absolute pointer-events-none rounded-xl"
            style={{
              top: spotlightRect.top - PAD + window.scrollY,
              left: spotlightRect.left - PAD,
              width: spotlightRect.width + PAD * 2,
              height: spotlightRect.height + PAD * 2,
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.60)",
              background: "transparent",
              border: "2px solid rgba(251,113,133,0.8)",
            }}
          />
        )}
      </div>

      {/* Tour card - optimized for mobile */}
      <div
        className="fixed z-[9100] left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-3 transition-all duration-300 max-h-[min(90vh,520px)] overflow-y-auto"
        style={{
          top: typeof cardTop === 'number' ? `${cardTop}px` : cardTop,
          transform: typeof cardTop === 'number' ? "translateX(-50%)" : "translate(-50%, -50%)",
          paddingBottom: `max(1.5rem, env(safe-area-inset-bottom))`,
        }}
      >
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-1 flex-shrink-0">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? "w-6 bg-rose-600" : "w-2 bg-slate-200"
                }`}
              />
            ))}
          </div>
          <button
            onClick={dismiss}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none ml-2 flex-shrink-0"
            aria-label="Skip tour"
          >
            ×
          </button>
        </div>

        {/* Content - scrollable on mobile */}
        <div className="flex-shrink-0">
          <div className="text-3xl mb-2">{current.emoji}</div>
          <h3 className="text-lg font-black text-slate-900 leading-tight mb-2">{current.title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{current.description}</p>
        </div>

        {/* Actions - always visible at bottom */}
        <div className="flex gap-3 mt-2 flex-shrink-0">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-700 text-sm font-semibold hover:border-slate-300 transition-colors"
            >
              ← Back
            </button>
          )}
          <button
            onClick={next}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 text-white text-sm font-bold shadow-lg hover:opacity-90 transition-opacity"
          >
            {isLast ? "Let's go! 🚀" : "Next →"}
          </button>
        </div>

        {/* Skip link - always visible */}
        {!isLast && (
          <button
            onClick={dismiss}
            className="text-xs text-slate-400 hover:text-slate-600 text-center mt-1 flex-shrink-0 transition-colors"
          >
            Skip tour
          </button>
        )}
      </div>
    </>
  );
}
