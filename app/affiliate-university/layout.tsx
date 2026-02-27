import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate University | QuoteXbert",
  description: "Free training on how to find contractors, maximize your affiliate earnings, and grow your passive income",
};

export default function AffiliateUniversityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
