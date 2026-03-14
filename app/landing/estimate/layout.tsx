import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check If Your Contractor Quote Is Fair | QuoteXbert",
  description:
    "Upload a photo or describe your renovation and get an AI-powered price estimate in seconds. Free for GTA homeowners. No sign-up required.",
  robots: {
    // Keep landing pages out of organic index to avoid cannibalising homepage
    index: false,
    follow: false,
  },
};

/** Minimal wrapper — inherits root layout fonts/providers but suppresses
 *  the mobile bottom nav via a data attribute read by MobileBottomNav. */
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return <div data-landing-page="true">{children}</div>;
}
