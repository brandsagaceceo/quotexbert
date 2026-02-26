import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import SiteHeader from "./_components/site-header";
import SiteFooter from "./_components/site-footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import DevStatus from "./_components/DevStatus";
import ProactiveAIHelper from "@/components/ProactiveAIHelper";
import AIAssistantPopup from "@/components/AIAssistantPopup";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { OverflowDebugger } from "@/components/OverflowDebugger";
import { ToastProvider } from "@/components/ToastProvider";
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
    default: "QuoteXbert | Instant Home Renovation Estimates in Toronto & GTA",
    template: "%s | QuoteXbert"
  },
  description:
    "Get instant AI-powered home renovation estimates in Toronto & the Greater Toronto Area. Upload photos, get free quotes from verified contractors. Kitchen, bathroom, basement renovations & more.",
  keywords: [
    "home renovation estimates Toronto",
    "Toronto contractors",
    "GTA home repair quotes",
    "instant renovation estimates",
    "AI contractor quotes",
    "Toronto kitchen renovation cost",
    "Toronto bathroom renovation",
    "basement finishing Toronto",
    "Durham Region contractors",
    "Ajax home renovation",
    "Bowmanville contractors",
    "Whitby renovation quotes",
    "verified contractors GTA",
    "home improvement Toronto",
    "renovation cost calculator"
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
    title: "QuoteXbert | Instant Home Renovation Estimates in Toronto & GTA", 
    description:
      "Upload photos and get instant AI-powered renovation estimates. Connect with verified contractors across Toronto and the Greater Toronto Area. Free, fast, and accurate.",
    siteName: "QuoteXbert",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "QuoteXbert - Instant Home Renovation Estimates in Toronto & GTA"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QuoteXbert - AI Home Renovation Estimates Toronto & GTA",
    description: "Get instant AI renovation estimates. Connect with verified GTA contractors. Upload photos, receive accurate quotes in minutes.",
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
                    "ratingValue": "5.0",
                    "reviewCount": "0"
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body
        className={`${interSans.variable} ${interMono.variable} antialiased bg-white text-[var(--ink-900)]`}
      >
        <ToastProvider>
          {/* Google Analytics & Tag Manager */}
          <GoogleAnalytics 
            GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
            GTM_ID={process.env.NEXT_PUBLIC_GTM_ID}
          />
          
          {/* Skip to content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white px-4 py-2 rounded-md z-50 focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main 
            id="main-content" 
            className="min-h-screen"
            style={{
              paddingBottom: 'calc(var(--bottom-nav-height, 72px) + env(safe-area-inset-bottom, 0px))',
            }}
          >
            {children}
          </main>
          <SiteFooter />
          <MobileBottomNav />
          <AIAssistantPopup />
          <DevStatus />
          <OverflowDebugger />
        </ToastProvider>
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
