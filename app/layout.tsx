import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import SiteHeader from "./_components/site-header";
import SiteFooter from "./_components/site-footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import DevStatus from "./_components/DevStatus";
import "./globals.css";
import "../styles/mobile.css";

export const dynamic = 'force-dynamic';

const interSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const interMono = Inter({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "https://www.quotexbert.com"),
  title: {
    default: "QuoteXbert - AI-Powered Home Repair Estimates & Contractor Matching",
    template: "%s | QuoteXbert"
  },
  description:
    "Get instant AI home repair estimates in seconds. Connect with verified, background-checked contractors across the Greater Toronto Area. Stripe-secured payments. Pay-per-lead system for contractors.",
  keywords: [
    "home repair estimates",
    "contractor quotes",
    "GTA contractors",
    "Toronto home repair",
    "AI estimates",
    "home improvement quotes",
    "verified contractors",
    "instant estimates",
    "home renovation quotes",
    "contractor marketplace"
  ],
  authors: [{ name: "QuoteXbert" }],
  creator: "QuoteXbert",
  publisher: "QuoteXbert",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://www.quotexbert.com",
    title: "QuoteXbert - AI-Powered Home Repair Estimates", 
    description:
      "Get instant AI home repair estimates and connect with verified contractors across the Greater Toronto Area. Stripe-secured payments, background-checked professionals.",
    siteName: "QuoteXbert",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "QuoteXbert - AI Home Repair Estimates"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QuoteXbert - AI-Powered Home Repair Estimates",
    description: "Get instant AI home repair estimates. Connect with verified GTA contractors. Stripe-secured payments.",
    images: ["/og-image.jpg"],
    creator: "@quotexbert",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://www.quotexbert.com"
  },
  verification: {
    google: "your-google-verification-code-here",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

  // Enable real Clerk authentication
  const enableAuth = true;

  const content = (
    <html lang="en">
      <head>
        {clarityId && (
          <Script
            id="clarity-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                  (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                  })(window, document, "clarity", "script", "${clarityId}");
                `,
            }}
          />
        )}
      </head>
      <body
        className={`${interSans.variable} ${interMono.variable} antialiased bg-[var(--ink-100)] text-[var(--ink-900)]`}
      >
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white px-4 py-2 rounded-md z-50 focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content" className="min-h-screen pb-20 md:pb-0">
          {children}
        </main>
        <SiteFooter />
        <MobileBottomNav />
        <DevStatus />
      </body>
    </html>
  );

  return enableAuth ? <ClerkProvider>{content}</ClerkProvider> : content;
}
