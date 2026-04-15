import type { Metadata } from "next";
import AffiliateSeoPage from "@/components/seo/AffiliateSeoPage";

export const metadata: Metadata = {
  title: "How to Make Money Referring Contractors — Earn $745+/mo",
  description:
    "Learn how to make money referring contractors to QuoteXbert. Earn 20% recurring commission for 12 months. Step-by-step guide to getting started.",
  keywords: [
    "make money referring contractors",
    "contractor referral income",
    "how to refer contractors",
    "earn money from contractor referrals",
    "contractor referral commission",
  ],
  openGraph: {
    title: "How to Make Money Referring Contractors — $745+/mo",
    description:
      "Step-by-step guide to earning 20% recurring commission by referring contractors to QuoteXbert.",
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
    icon: "1️⃣",
    title: "Join the Program",
    desc: "Enter your email below. You'll get a unique referral link instantly.",
  },
  {
    icon: "2️⃣",
    title: "Talk to Contractors",
    desc: "Know a roofer, plumber, painter, or GC? Tell them about QuoteXbert.",
  },
  {
    icon: "3️⃣",
    title: "Earn Every Month",
    desc: "When they subscribe, you earn 20% of their plan — monthly for 12 months.",
  },
];

export default function HowToMakeMoneyReferringContractorsPage() {
  return (
    <AffiliateSeoPage
      badge="📖 HOW-TO GUIDE"
      headline="How to Make Money Referring Contractors"
      subheadline="If you know contractors — painters, plumbers, roofers, GCs — you can earn serious recurring income by referring them to QuoteXbert."
      introText="Here's the simple truth: contractors constantly need leads, and platforms like QuoteXbert deliver those leads. When you refer a contractor and they subscribe, you earn 20% of their monthly payment for 12 months. A contractor on the $149/month plan earns you $29.80 every month — automatically. You don't need to sell anything. Just introduce them to a platform that helps them get more jobs. The platform does the selling. You collect the commission."
      earnings={earnings}
      steps={steps}
      ctaHeadline="Start Referring Contractors Today"
      ctaText="Get your free referral link and start earning 20% recurring commission."
    />
  );
}
