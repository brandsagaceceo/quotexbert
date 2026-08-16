import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QuoteXbert for Ontario Contractors | Features & Pricing",
  description:
    "Review QuoteXbert contractor marketplace features, paid subscription tiers, and Ontario homeowner project opportunities.",
  alternates: { canonical: "https://www.quotexbert.com/for-contractors" },
  openGraph: {
    title: "QuoteXbert for Ontario Contractors | Features & Pricing",
    description:
      "Review contractor marketplace features, paid subscription tiers, and Ontario homeowner project opportunities.",
    url: "https://www.quotexbert.com/for-contractors",
    type: "website",
  },
};

export default function ForContractorsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
