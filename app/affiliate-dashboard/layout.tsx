import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Dashboard | QuoteXbert",
  description: "Track your affiliate earnings, get your referral links, and download QR codes",
  robots: "noindex, nofollow" // Keep dashboard private
};

export default function AffiliateDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
