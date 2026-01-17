import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import SiteHeader from "./_components/site-header";
import SiteFooter from "./_components/site-footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import DevStatus from "./_components/DevStatus";
import { FloatingAIPrompt } from "@/components/ui/FloatingAIPrompt";
import { AIChatbot } from "@/components/AIChatbot";
import ProactiveAIHelper from "@/components/ProactiveAIHelper";
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
    default: "QuoteXbert - AI Home Repair Estimates Toronto, Whitby & GTA | Free Contractor Quotes",
    template: "%s | QuoteXbert - Toronto Home Repair Estimates"
  },
  description:
    "Get instant AI home repair estimates in Toronto, Whitby, and Greater Toronto Area. Connect with verified, background-checked contractors. Free quotes, secure payments. Available for basements, kitchens, roofing, and more.",
  keywords: [
    "home repair estimates Toronto",
    "contractor quotes Whitby",
    "GTA contractors",
    "Toronto home repair",
    "AI estimates Ontario",
    "home improvement quotes Greater Toronto Area",
    "verified contractors Toronto",
    "basement renovation Toronto",
    "kitchen renovation quotes Toronto",
    "home renovation estimates Whitby",
    "contractor marketplace GTA",
    "background checked contractors Toronto",
    "free home repair estimates",
    "local contractors near me",
    "home repair services Toronto",
    "roof repair quotes Toronto",
    "bathroom renovation Whitby",
    "contractor bidding platform Ontario"
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
    title: "QuoteXbert - AI Home Repair Estimates in Toronto & GTA", 
    description:
      "Get instant AI home repair estimates and connect with verified contractors in Toronto, Whitby, and Greater Toronto Area. Free quotes, background-checked professionals, secure Stripe payments.",
    siteName: "QuoteXbert",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "QuoteXbert - AI Home Repair Estimates Toronto"
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
      { url: "/favicon.svg", type: "image/svg+xml" },
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
        {/* Microsoft Clarity Analytics */}
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
        
        {/* Comprehensive Schema.org Structured Data */}
        <Script
          id="schema-org"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://www.quotexbert.com/#organization",
                  "name": "QuoteXbert",
                  "url": "https://www.quotexbert.com",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.quotexbert.com/logo.png"
                  },
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+1-416-XXX-XXXX",
                    "contactType": "Customer Service",
                    "areaServed": "CA"
                  }
                },
                {
                  "@type": "LocalBusiness",
                  "name": "QuoteXbert - Toronto Home Renovation Quotes",
                  "image": "https://www.quotexbert.com/og-image.jpg",
                  "url": "https://www.quotexbert.com",
                  "telephone": "+1-416-XXX-XXXX",
                  "priceRange": "$$",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Toronto",
                    "addressRegion": "ON",
                    "addressCountry": "CA"
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 43.6532,
                    "longitude": -79.3832
                  },
                  "areaServed": [
                    { "@type": "City", "name": "Toronto" },
                    { "@type": "City", "name": "Mississauga" },
                    { "@type": "City", "name": "Oshawa" },
                    { "@type": "City", "name": "Whitby" },
                    { "@type": "City", "name": "Ajax" }
                  ],
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.8",
                    "reviewCount": "127"
                  }
                }
              ]
            })
          }}
        />
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
        <FloatingAIPrompt />
        <AIChatbot />
        <ProactiveAIHelper delayMs={5000} />
        <DevStatus />
      </body>
    </html>
  );

  return enableAuth ? (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/onboarding"
      signUpFallbackRedirectUrl="/onboarding"
    >
      {content}
    </ClerkProvider>
  ) : content;
}
