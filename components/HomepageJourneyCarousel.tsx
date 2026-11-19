"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Briefcase, Camera, Images, Palette, Pause, Play, Sparkles, type LucideIcon } from "lucide-react";

interface Journey {
  title: string;
  description: string;
  label: string;
  action: string;
  icon: LucideIcon;
  href?: string;
}

const journeys: Journey[] = [
  {
    title: "Take a picture. Get a renovation estimate.",
    description: "Use Ontario pricing to explore an AI-assisted cost range before you hire. An estimate is not a binding contractor quote.",
    label: "Start with your photos",
    action: "Get my photo estimate",
    icon: Camera,
    href: "#estimator-tool",
  },
  {
    title: "Turn a photo into a project for bids.",
    description: "Start with an estimate, then review your project before requesting contractor quotes. An account and photo re-upload may be required.",
    label: "Review before posting",
    action: "Start a photo project",
    icon: Images,
    href: "#estimator-tool",
  },
  {
    title: "Post your renovation project.",
    description: "Add your scope, budget and photos in the existing job form. Review the details first; nothing is posted until you submit.",
    label: "Homeowner account required",
    action: "Prepare a job post",
    icon: Briefcase,
    href: "/create-lead",
  },
  {
    title: "Plan with QuoteXbert AI.",
    description: "Open the existing role-aware assistant. Guided AI planning requires an approved, enabled service and remains a preview.",
    label: "Planning preview",
    action: "Open QuoteXbert AI",
    icon: Sparkles,
  },
  {
    title: "Explore renovation photo visualization.",
    description: "Visit the existing room-design tool. Sign-in, enabled AI services and an available usage allowance are required.",
    label: "Visualization preview",
    action: "View visualization tool",
    icon: Palette,
    href: "/visualizer",
  },
  {
    title: "Find renovation inspiration.",
    description: "The social inspiration feed is not released. For now, browse a labelled stock-image design gallery, not customer projects.",
    label: "Example gallery",
    action: "Browse design examples",
    icon: Images,
    href: "/visualizer-library",
  },
];

export default function HomepageJourneyCarousel({ onOpenAssistant }: { onOpenAssistant: () => void }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const rotating = playing && !reducedMotion && !hovered && pageVisible;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      setReducedMotion(preference.matches);
      if (preference.matches) setPlaying(false);
    };
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    preference.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      preference.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(() => setActive(current => (current + 1) % journeys.length), 6000);
    return () => window.clearInterval(timer);
  }, [rotating]);

  const showJourney = (index: number) => {
    setPlaying(false);
    setActive((index + journeys.length) % journeys.length);
  };
  const actionClass = "inline-flex max-w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-center text-sm font-bold text-[#800020] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";
  const controlClass = "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Renovation journeys"
      tabIndex={0}
      className="homepage-banner animate-gradient min-w-0 rounded-3xl border border-white/20 p-5 text-white shadow-xl sm:p-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#800020]"
      style={{ touchAction: "pan-y" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setPlaying(false)}
      onKeyDown={event => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        const index = event.key === "ArrowRight" ? active + 1
          : event.key === "ArrowLeft" ? active - 1
          : event.key === "Home" ? 0
          : event.key === "End" ? journeys.length - 1 : null;
        if (index === null) return;
        event.preventDefault();
        event.currentTarget.focus();
        showJourney(index);
      }}
      onTouchStart={event => {
        touchStart.current = null;
        if (event.touches.length !== 1 || (event.target instanceof Element && event.target.closest("a,button"))) return;
        const point = event.touches[0];
        if (point) touchStart.current = { x: point.clientX, y: point.clientY };
        setPlaying(false);
      }}
      onTouchCancel={() => { touchStart.current = null; }}
      onTouchEnd={event => {
        const start = touchStart.current;
        const point = event.changedTouches[0];
        touchStart.current = null;
        if (!start || !point) return;
        const distance = point.clientX - start.x;
        if (Math.abs(distance) >= 60 && Math.abs(distance) > Math.abs(point.clientY - start.y) * 1.25) {
          showJourney(active + (distance < 0 ? 1 : -1));
        }
      }}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-rose-100">Choose your next step</p>
        <button
          type="button"
          disabled={reducedMotion}
          aria-label={reducedMotion ? "Automatic rotation disabled for reduced motion" : playing ? "Pause automatic rotation" : "Start automatic rotation"}
          onClick={() => setPlaying(current => !current)}
          className={`${controlClass} disabled:opacity-60`}
        >
          {playing && !reducedMotion ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
        </button>
      </div>
      <div className="grid" aria-live={rotating ? "off" : "polite"} aria-atomic="true">
        {journeys.map((journey, index) => {
          const current = index === active;
          const Icon = journey.icon;
          return (
            <div
              key={journey.title}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${journeys.length}`}
              aria-hidden={!current}
              className={`col-start-1 row-start-1 flex min-w-0 flex-col items-start transition-opacity duration-500 motion-reduce:transition-none ${current ? "opacity-100" : "pointer-events-none opacity-0"}`}
            >
              <span className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-rose-100">
                <Icon size={16} className="shrink-0" aria-hidden="true" />
                {journey.label}
              </span>
              <h2 className="mb-4 text-left text-3xl font-black leading-tight tracking-tight sm:text-4xl">{journey.title}</h2>
              <p className="mb-6 text-left text-base leading-relaxed text-rose-100">{journey.description}</p>
              {journey.href ? (
                <Link href={journey.href} tabIndex={current ? 0 : -1} className={`${actionClass} mt-auto`}>
                  {journey.action}<ArrowRight size={18} className="shrink-0" aria-hidden="true" />
                </Link>
              ) : (
                <button type="button" onClick={onOpenAssistant} tabIndex={current ? 0 : -1} className={`${actionClass} mt-auto`}>
                  {journey.action}<ArrowRight size={18} className="shrink-0" aria-hidden="true" />
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button type="button" onClick={() => showJourney(active - 1)} aria-label="Previous journey" className={controlClass}>
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => showJourney(active + 1)} aria-label="Next journey" className={controlClass}>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="flex">
          {journeys.map((journey, index) => (
            <button
              key={journey.title}
              type="button"
              onClick={() => showJourney(index)}
              aria-label={`Show journey ${index + 1}: ${journey.title}`}
              aria-current={index === active ? "true" : undefined}
              className="flex h-11 w-6 items-center justify-center rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <span aria-hidden="true" className={`h-2 w-2 rounded-full ${index === active ? "bg-white" : "bg-white/40"}`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
