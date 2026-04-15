import type { Metadata } from "next";
import AffiliateSeoPage from "@/components/seo/AffiliateSeoPage";

export const metadata: Metadata = {
  title: "Affiliate Marketing Toronto — Earn 20% Recurring with QuoteXbert",
  description:
    "Start affiliate marketing in Toronto with QuoteXbert. Earn 20% recurring commission for 12 months on every contractor subscription you refer.",
  keywords: [
    "affiliate marketing Toronto",
    "affiliate programs Toronto",
    "affiliate income Toronto",
    "start affiliate marketing Canada",
    "best affiliate programs Toronto",
  ],
  openGraph: {
    title: "Affiliate Marketing Toronto — 20% Recurring Commission",
    description:
      "Earn 20% recurring commission for 12 months. No website needed. Join the QuoteXbert affiliate program today.",
  },
};

const earnings = [
  { contractors: "5 contractors", monthly: "$149/mo", annual: "$1,788/yr" },
  { contractors: "10 contractors", monthly: "$298/mo", annual: "$3,576/yr" },
  {
    contractors: "25 contractors",
    monthly: "$745/mo",
    annual: "$8,940/yr",
    highlight: true,
  },
  { contractors: "50 contractors", monthly: "$1,490/mo", annual: "$17,880/yr" },
  { contractors: "100 contractors", monthly: "$2,980/mo", annual: "$35,760/yr" },
];

const steps = [
  {
    icon: "✉️",
    title: "Sign Up Free",
    desc: "No website, blog, or following required. Just your email.",
  },
  {
    icon: "🎯",
    title: "Target Contractors",
    desc: "The home renovation industry in Toronto is booming.",
  },
  {
    icon: "💸",
    title: "Earn Recurring",
    desc: "20% every month for 12 months — not just a one-time bounty.",
  },
];

export default function AffiliateMarketingTorontoPage() {
  return (
    <AffiliateSeoPage
      badge="🎯 AFFILIATE MARKETING — TORONTO"
      headline="Affiliate Marketing That Actually Pays — In Toronto"
      subheadline="Most affiliate programs pay you once. QuoteXbert pays you every month for 12 months per referral. No blog, no website, no audience needed."
      introText="If you've tried affiliate marketing before, you know most programs pay a tiny one-time commission that barely covers your effort. QuoteXbert is different. When you refer a contractor in Toronto to our platform, you earn 20% of their subscription — every single month — for a full year. That's real recurring revenue in one of Canada's hottest industries: home renovation. You don't need a website, a YouTube channel, or a big following. Just share your link with contractors who need leads."
      earnings={earnings}
      steps={steps}
      ctaHeadline="Start Affiliate Marketing Today"
      ctaText="Join free and get your referral link instantly. No website or audience required."
    />
  );
}
