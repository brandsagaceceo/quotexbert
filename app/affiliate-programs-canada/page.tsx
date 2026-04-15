import type { Metadata } from "next";
import AffiliateSeoPage from "@/components/seo/AffiliateSeoPage";

export const metadata: Metadata = {
  title: "Affiliate Programs Canada — Earn 20% Recurring | QuoteXbert",
  description:
    "Join one of the best affiliate programs in Canada. Earn 20% recurring commission for 12 months referring contractors to QuoteXbert. Free to join.",
  keywords: [
    "affiliate programs Canada",
    "Canadian affiliate programs",
    "best affiliate programs Canada",
    "referral programs Canada",
    "affiliate marketing Canada",
  ],
  openGraph: {
    title: "Affiliate Programs Canada — 20% Recurring Commission",
    description:
      "Earn recurring income with one of the best Canadian affiliate programs. Refer contractors and get paid monthly.",
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
    icon: "🇨🇦",
    title: "Canadian Program",
    desc: "Built for Canada. Payouts in CAD. No cross-border hassle.",
  },
  {
    icon: "🔗",
    title: "Get Your Link",
    desc: "Instant referral link. Share anywhere — social, email, in-person.",
  },
  {
    icon: "🔄",
    title: "12-Month Payouts",
    desc: "Earn 20% commission every month for a full year per referral.",
  },
];

export default function AffiliateProgramsCanadaPage() {
  return (
    <AffiliateSeoPage
      badge="🇨🇦 AFFILIATE PROGRAMS — CANADA"
      headline="Canada's Best-Paying Affiliate Program for Contractors"
      subheadline="Most Canadian affiliate programs pay a one-time commission. QuoteXbert pays you 20% recurring — every month for 12 months — in CAD."
      introText="Finding affiliate programs that actually work in Canada is tough. Most are US-focused, pay in USD, and offer tiny one-time commissions. QuoteXbert is a Canadian platform, paying in CAD, with 20% recurring commission for 12 full months on every contractor you refer. The home renovation market in Canada is worth over $80 billion — and contractors are actively looking for lead generation platforms. You connect them, we pay you."
      earnings={earnings}
      steps={steps}
      ctaHeadline="Join Canada's Best Affiliate Program"
      ctaText="Free to join. Paid in CAD. Earn 20% recurring for 12 months per contractor."
    />
  );
}
