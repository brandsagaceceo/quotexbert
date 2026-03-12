import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import SiteHeader from "./_components/site-header";
import SiteFooter from "./_components/site-footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { ToastProvider } from "@/components/ToastProvider";
import dynamicImport from "next/dynamic";
import "./globals.css";
import "../styles/mobile.css";

export const dynamic = 'force-dynamic';

// Lazy load development and optional components
const DevStatus = dynamicImport(() => import("./_components/DevStatus"), { ssr: false });
const OverflowDebugger = dynamicImport(() => import("@/components/OverflowDebugger").then(mod => ({ default: mod.OverflowDebugger })), { ssr: false });
const AIAssistantPopup = dynamicImport(() => import("@/components/AIAssistantPopup"), { ssr: false });

const interSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const interMono = Inter({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "https://www.quotexbert.com"),
  title: {
    default: "QuoteXbert – Instant AI Renovation Quotes in Toronto",
    template: "%s | QuoteXbert"
  },
  description:
    "Upload a photo of your renovation and get an instant AI-powered price estimate. Connect with trusted contractors across Toronto and the GTA.",
  keywords: [
    "renovation cost Toronto",
    "AI renovation estimate",
    "contractor quotes Toronto",
    "bathroom renovation cost Toronto",
    "kitchen renovation price GTA",
    "home renovation estimates Toronto",
    "Toronto contractors",
    "GTA home repair quotes",
    "instant renovation estimates",
    "basement finishing Toronto",
    "Durham Region contractors",
    "Scarborough renovation quotes",
    "Mississauga contractors",
    "verified contractors GTA",
    "renovation cost calculator",
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
    title: "QuoteXbert – Instant AI Renovation Quotes in Toronto",
    description:
      "Upload a photo of your renovation and get an instant AI-powered price estimate. Connect with trusted contractors across Toronto and the GTA.",
    siteName: "QuoteXbert",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "QuoteXbert – Instant AI Renovation Quotes in Toronto & GTA"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QuoteXbert – Instant AI Renovation Quotes in Toronto",
    description: "Upload a photo of your renovation and get an instant AI-powered price estimate. Connect with trusted contractors across Toronto and the GTA.",
    images: ["/twitter-image.svg"],
    creator: "@quotexbert",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon.svg",
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

        {/* Google Ads Conversion Tracking */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17979635426"
          strategy="afterInteractive"
        />
        <Script
          id="google-ads"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17979635426');
            `,
          }}
        />
        
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
                    "url": "https://www.quotexbert.com/quotexbert-robot.png"
                  },
                  "description": "AI-powered renovation estimates for Toronto homeowners. Upload a photo and get an instant price estimate.",
                  "sameAs": [
                    "https://twitter.com/quotexbert",
                    "https://www.instagram.com/quotexbert"
                  ],
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "contactType": "Customer Service",
                    "areaServed": "CA"
                  }
                },
                {
                  "@type": "LocalBusiness",
                  "@id": "https://www.quotexbert.com/#localbusiness",
                  "name": "QuoteXbert",
                  "description": "AI-powered renovation estimates for Toronto and GTA homeowners. Upload a photo, get an instant estimate, connect with trusted contractors.",
                  "image": "https://www.quotexbert.com/og-image.svg",
                  "url": "https://www.quotexbert.com",
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
                    { "@type": "City", "name": "North York" },
                    { "@type": "City", "name": "Scarborough" },
                    { "@type": "City", "name": "Etobicoke" },
                    { "@type": "City", "name": "Mississauga" },
                    { "@type": "City", "name": "Brampton" },
                    { "@type": "City", "name": "Vaughan" },
                    { "@type": "City", "name": "Markham" },
                    { "@type": "City", "name": "Richmond Hill" },
                    { "@type": "City", "name": "Ajax" },
                    { "@type": "City", "name": "Pickering" },
                    { "@type": "City", "name": "Whitby" }
                  ],
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "5.0",
                    "reviewCount": "0"
                  }
                },
                {
                  "@type": "Service",
                  "@id": "https://www.quotexbert.com/#service",
                  "name": "AI Renovation Estimate Platform",
                  "description": "Upload a photo of your renovation project and receive an instant AI-powered price estimate. Connect with verified contractors across Toronto and the GTA.",
                  "provider": {
                    "@id": "https://www.quotexbert.com/#organization"
                  },
                  "areaServed": "Toronto, GTA",
                  "serviceType": "Home Renovation Estimation",
                  "url": "https://www.quotexbert.com"
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
          {process.env.NODE_ENV === 'development' && (
            <>
              <DevStatus />
              <OverflowDebugger />
            </>
          )}
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
