import type { Metadata } from "next";
import AffiliateSeoPage from "@/components/seo/AffiliateSeoPage";

export const metadata: Metadata = {
  title: "Make Money Online in Toronto — Earn $2,980/mo Referring Contractors",
  description:
    "Looking to make money online in Toronto? Earn 20% recurring commission referring contractors to QuoteXbert. No experience needed. Free to join.",
  keywords: [
    "make money online Toronto",
    "earn money online Toronto",
    "online income Toronto",
    "side income Toronto",
    "work from home Toronto",
  ],
  openGraph: {
    title: "Make Money Online in Toronto — Earn Up to $2,980/mo",
    description:
      "Earn 20% recurring commission referring contractors to QuoteXbert. Free to join, no experience needed.",
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
    icon: "📝",
    title: "Sign Up Free",
    desc: "Enter your email and get your unique referral link instantly.",
  },
  {
    icon: "📤",
    title: "Share Your Link",
    desc: "Share with contractors in Toronto who need renovation leads.",
  },
  {
    icon: "💰",
    title: "Earn 20% Monthly",
    desc: "Get paid every month for 12 months per contractor referred.",
  },
];

export default function MakeMoneyOnlineTorontoPage() {
  return (
    <AffiliateSeoPage
      badge="💰 MAKE MONEY ONLINE — TORONTO"
      headline="Make Real Money Online in Toronto"
      subheadline="Earn 20% recurring commission by referring contractors to Canada's fastest-growing renovation platform. No inventory, no shipping, no experience required."
      introText="Tired of survey sites and gig apps that pay pennies? QuoteXbert pays you real, recurring income for connecting Toronto contractors with homeowner leads. Refer a contractor once, earn commission every month for a full year. With average subscriptions at $149/month, that's $29.80/month per referral — and it compounds as you refer more."
      earnings={earnings}
      steps={steps}
      ctaHeadline="Start Making Money Online Today"
      ctaText="Join the QuoteXbert affiliate program and turn your Toronto network into real monthly income."
    />
  );
}
