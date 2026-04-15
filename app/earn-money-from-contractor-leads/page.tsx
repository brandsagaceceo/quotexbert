import type { Metadata } from "next";
import AffiliateSeoPage from "@/components/seo/AffiliateSeoPage";

export const metadata: Metadata = {
  title: "Earn Money from Contractor Leads — $29.80/mo Per Referral",
  description:
    "Earn money from contractor leads by referring contractors to QuoteXbert. 20% recurring commission for 12 months. Free to join, no experience needed.",
  keywords: [
    "earn money from contractor leads",
    "contractor lead commission",
    "make money contractor leads",
    "contractor lead referral income",
    "sell contractor leads",
  ],
  openGraph: {
    title: "Earn Money from Contractor Leads — $29.80/mo Per Referral",
    description:
      "Refer contractors to QuoteXbert and earn 20% recurring commission for 12 months. No experience needed.",
  },
};

const earnings = [
  { contractors: "3 contractors", monthly: "$89/mo", annual: "$1,073/yr" },
  { contractors: "5 contractors", monthly: "$149/mo", annual: "$1,788/yr" },
  {
    contractors: "10 contractors",
    monthly: "$298/mo",
    annual: "$3,576/yr",
    highlight: true,
  },
  { contractors: "25 contractors", monthly: "$745/mo", annual: "$8,940/yr" },
  { contractors: "50 contractors", monthly: "$1,490/mo", annual: "$17,880/yr" },
];

const steps = [
  {
    icon: "🔑",
    title: "Get Access",
    desc: "Sign up free and get your unique referral link instantly.",
  },
  {
    icon: "👷",
    title: "Connect Contractors",
    desc: "Refer any contractor who needs renovation or home service leads.",
  },
  {
    icon: "💰",
    title: "Collect Commission",
    desc: "$29.80/month per contractor on the standard plan — for 12 months.",
  },
];

export default function EarnMoneyFromContractorLeadsPage() {
  return (
    <AffiliateSeoPage
      badge="💰 EARN FROM CONTRACTOR LEADS"
      headline="Earn Money Every Time a Contractor Gets Leads"
      subheadline="You don't sell leads directly — you refer contractors to QuoteXbert, and we pay you 20% of their subscription every month for 12 months."
      introText="Contractor leads are big business. QuoteXbert connects homeowners with verified contractors and charges contractors a monthly subscription for access to leads. When you refer a contractor to the platform and they subscribe, you earn 20% of their monthly payment — automatically, for 12 full months. On the $149/month plan, that's $29.80/month per referral. You don't generate the leads, manage the platform, or handle billing. You just make the introduction. We handle the rest and pay you."
      earnings={earnings}
      steps={steps}
      ctaHeadline="Start Earning from Contractor Leads"
      ctaText="Join free. Refer contractors. Earn $29.80/month per referral for 12 months."
    />
  );
}
