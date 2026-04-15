import type { Metadata } from "next";
import AffiliateSeoPage from "@/components/seo/AffiliateSeoPage";

export const metadata: Metadata = {
  title: "Best Affiliate Programs Canada 2026 — 20% Recurring Commission",
  description:
    "Discover the best affiliate programs in Canada for 2026. QuoteXbert pays 20% recurring commission for 12 months. No fees, no experience needed.",
  keywords: [
    "best affiliate programs Canada 2026",
    "top affiliate programs Canada",
    "highest paying affiliate programs Canada",
    "best referral programs Canada",
    "affiliate programs that pay well Canada",
  ],
  openGraph: {
    title: "Best Affiliate Programs Canada 2026 — 20% Recurring",
    description:
      "QuoteXbert: 20% recurring commission for 12 months. One of the best-paying affiliate programs in Canada.",
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
    icon: "⭐",
    title: "Why QuoteXbert?",
    desc: "20% recurring > one-time bounties. Contractors stay for years.",
  },
  {
    icon: "📱",
    title: "Easy to Share",
    desc: "One link. Share via text, social media, email, or in person.",
  },
  {
    icon: "💰",
    title: "Real Money",
    desc: "$29.80/mo per referral. Stack referrals for serious income.",
  },
];

export default function BestAffiliateProgramsCanadaPage() {
  return (
    <AffiliateSeoPage
      badge="⭐ BEST AFFILIATE PROGRAMS — CANADA 2026"
      headline="The Best Affiliate Program in Canada for Real Income"
      subheadline="Comparing affiliate programs? QuoteXbert offers 20% recurring commission for 12 months — that beats one-time payouts from most programs."
      introText="Here's why QuoteXbert ranks among the best affiliate programs in Canada for 2026: while most programs pay you $5–$50 once and forget about you, QuoteXbert pays 20% of each contractor's monthly subscription for 12 straight months. On a $149/month plan, that's $29.80/month per referral — or $357.60 over the year from a single referral. Stack 25 contractors and you're earning $745/month in genuinely passive income. It's free to join, there are no payout minimums, and you get paid in CAD."
      earnings={earnings}
      steps={steps}
      ctaHeadline="Join the Best Affiliate Program in Canada"
      ctaText="20% recurring. 12 months. Free to join. No payout minimums. Start now."
    />
  );
}
