import type { Metadata } from "next";
import AffiliateSeoPage from "@/components/seo/AffiliateSeoPage";

export const metadata: Metadata = {
  title: "Passive Income Canada — Earn $2,980/mo Referring Contractors",
  description:
    "Build passive income in Canada with the QuoteXbert affiliate program. Earn 20% recurring commission for 12 months on every contractor you refer.",
  keywords: [
    "passive income Canada",
    "passive income ideas Canada",
    "recurring income Canada",
    "earn passive income online Canada",
    "passive income streams Canada 2026",
  ],
  openGraph: {
    title: "Passive Income Canada — Earn Up to $2,980/mo",
    description:
      "Refer contractors to QuoteXbert and earn recurring 20% commission for 12 months. True passive income in Canada.",
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
    icon: "🔗",
    title: "Get Your Link",
    desc: "Sign up free and receive your unique referral link in seconds.",
  },
  {
    icon: "📣",
    title: "Refer Contractors",
    desc: "Share with contractors anywhere in Canada who need leads.",
  },
  {
    icon: "📈",
    title: "Watch It Compound",
    desc: "Each referral earns you 20% monthly for a full year.",
  },
];

export default function PassiveIncomeCanadaPage() {
  return (
    <AffiliateSeoPage
      badge="📈 PASSIVE INCOME — CANADA"
      headline="Build Real Passive Income in Canada"
      subheadline="Refer contractors once. Get paid every month for 12 months. The more you refer, the more it compounds — real recurring revenue, not a one-time payout."
      introText="Most passive income ideas require large upfront capital or complex setup. The QuoteXbert affiliate program requires neither. Sign up for free, share your referral link with contractors across Canada, and earn 20% of their monthly subscription for a full year. With plans averaging $149/month CAD, every referral adds $29.80/month to your income. Refer 25 contractors and you're earning $745/month — automatically."
      earnings={earnings}
      steps={steps}
      ctaHeadline="Start Building Passive Income"
      ctaText="No capital required. No ongoing work. Refer contractors and earn monthly for 12 months."
    />
  );
}
