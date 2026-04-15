import type { Metadata } from "next";
import AffiliateSeoPage from "@/components/seo/AffiliateSeoPage";

export const metadata: Metadata = {
  title: "Contractor Referral Program Canada — 20% Recurring Commission",
  description:
    "Join Canada's top contractor referral program. Earn 20% recurring commission for 12 months by referring contractors to QuoteXbert. Free to join.",
  keywords: [
    "contractor referral program Canada",
    "contractor referral commission",
    "refer contractors Canada",
    "contractor lead referral program",
    "renovation referral program Canada",
  ],
  openGraph: {
    title: "Contractor Referral Program Canada — 20% Recurring",
    description:
      "Earn 20% recurring for 12 months by referring contractors to QuoteXbert. Canada's top contractor referral program.",
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
    icon: "🏗️",
    title: "Know Contractors?",
    desc: "Painters, plumbers, electricians, roofers, GCs — they all qualify.",
  },
  {
    icon: "📲",
    title: "Send Your Link",
    desc: "Share your unique referral link via text, email, or social.",
  },
  {
    icon: "💵",
    title: "Earn Monthly",
    desc: "20% of their subscription, every month, for 12 months.",
  },
];

export default function ContractorReferralProgramCanadaPage() {
  return (
    <AffiliateSeoPage
      badge="🏗️ CONTRACTOR REFERRAL — CANADA"
      headline="Canada's #1 Contractor Referral Program"
      subheadline="Refer contractors to QuoteXbert and earn 20% recurring commission for 12 months. No limits on how many you can refer."
      introText="The home renovation industry in Canada is booming, and contractors are hungry for quality leads. QuoteXbert connects them with homeowners who need work done — and pays you for making the introduction. Our contractor referral program gives you 20% of every referred contractor's monthly subscription for a full year. Whether you know one contractor or a hundred, every referral adds to your monthly income. It's free to join, there are no caps, and payouts are in Canadian dollars."
      earnings={earnings}
      steps={steps}
      ctaHeadline="Join the Referral Program"
      ctaText="Free to join. Unlimited referrals. 20% recurring commission in CAD."
    />
  );
}
