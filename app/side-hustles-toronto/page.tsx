import type { Metadata } from "next";
import AffiliateSeoPage from "@/components/seo/AffiliateSeoPage";

export const metadata: Metadata = {
  title: "Best Side Hustles Toronto 2026 — Earn $745+/mo Referring Contractors",
  description:
    "Looking for a side hustle in Toronto? Earn 20% recurring commission referring contractors to QuoteXbert. No inventory, no deliveries, no startup cost.",
  keywords: [
    "side hustles Toronto",
    "side hustle ideas Toronto",
    "best side hustles Toronto 2026",
    "extra income Toronto",
    "side gig Toronto",
  ],
  openGraph: {
    title: "Best Side Hustles Toronto 2026 — Earn $745+/mo",
    description:
      "Earn recurring income with zero startup cost. Refer contractors to QuoteXbert and get paid every month.",
  },
};

const earnings = [
  { contractors: "3 contractors", monthly: "$89/mo", annual: "$1,073/yr" },
  { contractors: "5 contractors", monthly: "$149/mo", annual: "$1,788/yr" },
  {
    contractors: "15 contractors",
    monthly: "$447/mo",
    annual: "$5,364/yr",
    highlight: true,
  },
  { contractors: "25 contractors", monthly: "$745/mo", annual: "$8,940/yr" },
  { contractors: "50 contractors", monthly: "$1,490/mo", annual: "$17,880/yr" },
];

const steps = [
  {
    icon: "🚀",
    title: "Join in 30 Seconds",
    desc: "No application, no startup cost. Just enter your email.",
  },
  {
    icon: "🤝",
    title: "Tell Contractors",
    desc: "Know a painter, plumber, or roofer? Send them your link.",
  },
  {
    icon: "🔄",
    title: "Earn Every Month",
    desc: "20% commission, every month, for 12 months per referral.",
  },
];

export default function SideHustlesTorontoPage() {
  return (
    <AffiliateSeoPage
      badge="🔥 TOP SIDE HUSTLE — TORONTO"
      headline="The Side Hustle That Pays You Every Month"
      subheadline="Forget driving for rideshare or flipping items online. Refer contractors once and earn recurring income for a full year — while you sleep."
      introText="Most side hustles in Toronto trade your time for money. The QuoteXbert affiliate program is different: refer a contractor to our platform, and you earn 20% of their subscription every single month for 12 months. That means one referral can pay you $29.80/month — and every new referral stacks on top. No deliveries, no inventory, no schedule. Just share your link and get paid."
      earnings={earnings}
      steps={steps}
      ctaHeadline="Start Your Best Side Hustle"
      ctaText="Free to join. No fees ever. Start earning recurring income this week."
    />
  );
}
