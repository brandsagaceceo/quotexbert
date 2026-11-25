"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Briefcase, Camera, Images, Palette, Pause, Play, Sparkles, type LucideIcon } from "lucide-react";
import photoEstimate from "@/public/homepage/photo-estimate.webp";
import contractorFlooring from "@/public/homepage/contractor-flooring.webp";
import contractorTeam from "@/public/homepage/contractor-team.webp";
import renovationPlanning from "@/public/homepage/renovation-planning.webp";
import finishedKitchen from "@/public/homepage/finished-kitchen.webp";
import finishedLivingRoom from "@/public/homepage/finished-living-room.webp";

interface Journey {
  title: string;
  description: string;
  label: string;
  action: string;
  icon: LucideIcon;
  href?: string;
  photo: StaticImageData;
  alt: string;
  photographer: string;
  source: string;
  mobilePosition: string;
  desktopPosition: string;
}

interface PhotoStyle extends CSSProperties {
  "--journey-mobile-position": string;
  "--journey-desktop-position": string;
}

const journeys: Journey[] = [
  {
    title: "Take a Picture. Get an Instant Renovation Quote.",
    description: "Explore an AI-assisted cost range before you hire. An estimate is not a binding contractor quote.",
    label: "Start with your photos",
    action: "Get My Estimate",
    icon: Camera,
    href: "#estimator-tool",
    photo: photoEstimate,
    alt: "A woman taking smartphone photos inside a bright kitchen and living space.",
    photographer: "MART PRODUCTION",
    source: "https://www.pexels.com/photo/woman-taking-photos-using-her-cellphone-7414962/",
    mobilePosition: "52% 25%",
    desktopPosition: "50% 25%",
  },
  {
    title: "Post a Job From a Picture. Get Local Contractor Bids.",
    description: "Share project photos and details. Local bids depend on your project area and contractor availability.",
    label: "Review before posting",
    action: "Post a Job",
    icon: Images,
    href: "/create-lead",
    photo: contractorTeam,
    alt: "Two architects reviewing renovation plans inside a newly built home.",
    photographer: "Thirdman",
    source: "https://www.pexels.com/photo/people-holding-a-piece-of-paper-while-standing-near-white-walls-8470045/",
    mobilePosition: "54% 30%",
    desktopPosition: "50% 35%",
  },
  {
    title: "Plan Your Renovation Smarter With QuoteXbert AI.",
    description: "Open the planning assistant. Guided AI planning is a preview and may not be enabled yet.",
    label: "Planning preview",
    action: "Plan My Project",
    icon: Sparkles,
    photo: renovationPlanning,
    alt: "Two people comparing fabric and colour samples together at a design table.",
    photographer: "Thirdman",
    source: "https://www.pexels.com/photo/women-looking-through-fabric-samples-8485587/",
    mobilePosition: "60% 48%",
    desktopPosition: "50% 38%",
  },
  {
    title: "See Your Renovation Before You Start.",
    description: "Explore the room-design preview. Sign-in, an enabled AI service and an available usage allowance are required.",
    label: "Visualization preview",
    action: "Try Photo Visualization",
    icon: Palette,
    href: "/visualizer",
    photo: finishedKitchen,
    alt: "A finished white kitchen with a large island, pendant lighting and a sunny dining area.",
    photographer: "Mark McCammon",
    source: "https://www.pexels.com/photo/kitchen-and-dining-area-1080721/",
    mobilePosition: "67% 35%",
    desktopPosition: "50% 45%",
  },
  {
    title: "Get Inspired by Real Home Renovations.",
    description: "Browse licensed stock-photo design examples, not customer projects. The social inspiration feed is coming soon.",
    label: "Example gallery",
    action: "Explore Example Gallery",
    icon: Images,
    href: "/visualizer-library",
    photo: finishedLivingRoom,
    alt: "A completed contemporary living room with a curved sofa, warm wood stairs and detailed lighting.",
    photographer: "Viaceslav Kat",
    source: "https://www.pexels.com/photo/interior-design-of-a-house-1571460/",
    mobilePosition: "57% 35%",
    desktopPosition: "50% 50%",
  },
  {
    title: "Find Local Renovation Opportunities.",
    description: "Browse renovation leads in your service area. Contractor account and sign-in are required.",
    label: "For contractors",
    action: "Browse Jobs",
    icon: Briefcase,
    href: "/contractor/jobs",
    photo: contractorFlooring,
    alt: "A flooring installer fitting wood flooring inside a home.",
    photographer: "K",
    source: "https://www.pexels.com/photo/crop-man-installing-laminate-flooring-4263067/",
    mobilePosition: "78% 30%",
    desktopPosition: "50% 35%",
  },
];

export default function HomepageJourneyCarousel({ onOpenAssistant }: { onOpenAssistant: () => void }) {
  const [active, setActive] = useState(0);
  const [target, setTarget] = useState(0);
  const [preparedPhotos, setPreparedPhotos] = useState<number[]>([0]);
  const [loadedPhotos, setLoadedPhotos] = useState<number[]>([]);
  const [failedPhotos, setFailedPhotos] = useState<number[]>([]);
  const [playing, setPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const rotating = playing && !reducedMotion && !hovered && pageVisible;

  useEffect(() => {
    if (!loadedPhotos.includes(target)) return;
    setActive(target);
    // Warm only the next photograph, and keep the previous scene until its replacement is ready.
    const next = (target + 1) % journeys.length;
    setPreparedPhotos(previous => previous.includes(next) ? previous : [...previous, next]);
  }, [target, loadedPhotos]);

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
    const timer = window.setInterval(() => setTarget(current => (current + 1) % journeys.length), 6000);
    return () => window.clearInterval(timer);
  }, [rotating]);

  const showJourney = (index: number) => {
    setPlaying(false);
    setTarget((index + journeys.length) % journeys.length);
  };
  const actionClass = "inline-flex max-w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-3.5 text-center text-sm font-bold text-[#800020] shadow-lg transition-colors hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";
  const controlClass = "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/50 bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Renovation journeys"
      tabIndex={0}
      className="journey-carousel relative isolate min-w-0 overflow-hidden bg-[#260611] text-white shadow-xl sm:rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#800020]"
      aria-busy={target !== active && !failedPhotos.includes(target)}
      style={{ touchAction: "pan-y" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setPlaying(false)}
      onKeyDown={event => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        const index = event.key === "ArrowRight" ? target + 1
          : event.key === "ArrowLeft" ? target - 1
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
          showJourney(target + (distance < 0 ? 1 : -1));
        }
      }}
    >
      <div className="absolute right-5 top-5 z-20">
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
          const photoStyle: PhotoStyle = {
            "--journey-mobile-position": journey.mobilePosition,
            "--journey-desktop-position": journey.desktopPosition,
          };
          return (
            <div
              key={journey.title}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${journeys.length}`}
              aria-hidden={!current}
              className={`journey-slide col-start-1 row-start-1 min-w-0 transition-opacity duration-500 motion-reduce:transition-none ${current ? "z-10 opacity-100" : "pointer-events-none opacity-0"}`}
            >
              <div className="journey-photo" style={photoStyle}>
                {(index === target || preparedPhotos.includes(index)) && (
                  <Image
                    src={journey.photo}
                    alt={journey.alt}
                    fill
                    sizes="(min-width: 1600px) 1536px, 100vw"
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    placeholder="blur"
                    className="journey-photo-image"
                    onLoad={() => {
                      setLoadedPhotos(previous => previous.includes(index) ? previous : [...previous, index]);
                      setPreparedPhotos(previous => previous.includes(index) ? previous : [...previous, index]);
                      setFailedPhotos(previous => previous.includes(index) ? previous.filter(failed => failed !== index) : previous);
                    }}
                    onError={() => setFailedPhotos(previous => previous.includes(index) ? previous : [...previous, index])}
                  />
                )}
              </div>
              <div className="journey-photo-overlay" aria-hidden="true" />
              <a
                href={journey.source}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={current ? 0 : -1}
                className="journey-photo-credit"
              >
                Stock photo: {journey.photographer} / Pexels
              </a>
              <div className="journey-copy">
                <span className="mb-4 inline-flex max-w-full items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white">
                  <Icon size={16} className="shrink-0" aria-hidden="true" />
                  {journey.label}
                </span>
                <h2 className="journey-heading">{journey.title}</h2>
                <p className="journey-description">{journey.description}</p>
                {journey.href ? (
                  <Link href={journey.href} tabIndex={current ? 0 : -1} className={actionClass}>
                    {journey.action}<ArrowRight size={18} className="shrink-0" aria-hidden="true" />
                  </Link>
                ) : (
                  <button type="button" onClick={onOpenAssistant} tabIndex={current ? 0 : -1} className={actionClass}>
                    {journey.action}<ArrowRight size={18} className="shrink-0" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {failedPhotos.includes(target) ? (
        <p role="alert" className="absolute inset-x-5 top-20 z-20 rounded-lg bg-[#260611] p-3 text-sm text-white">
          This photograph could not load. Choose another slide or refresh to try again.
        </p>
      ) : target !== active ? (
        <p role="status" className="absolute inset-x-5 top-20 z-20 text-center text-sm text-white">
          Loading photograph...
        </p>
      ) : null}
      <div className="journey-navigation absolute inset-x-0 bottom-5 z-20 flex items-center justify-between gap-3 px-5 lg:px-12">
        <div className="flex gap-2">
          <button type="button" onClick={() => showJourney(target - 1)} aria-label="Previous journey" className={controlClass}>
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => showJourney(target + 1)} aria-label="Next journey" className={controlClass}>
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
