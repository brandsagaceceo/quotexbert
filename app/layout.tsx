import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import SiteHeader from "./_components/site-header";
import SiteFooter from "./_components/site-footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import DevStatus from "./_components/DevStatus";
import "./globals.css";
import "../styles/mobile.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "http://localhost:3000"),
  title: "QuoteXbert - AI-Powered Home Repair Estimates & Contractor Matching",
  description:
    "Get instant AI home repair estimates. Connect with verified contractors. Pay-per-lead system. Join 1000+ contractors earning more with QuoteXbert.",
  openGraph: {
    title: "QuoteXbert - AI Home Repair Estimates", 
    description:
      "Get instant AI home repair estimates and connect with verified contractors in your area.",
    siteName: "QuoteXbert",
    images: ["/og-homepage.jpg"],
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

  // Temporarily disable Clerk for demo purposes
  const enableAuth = false; // Set to true when you have real Clerk keys

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--ink-100)] text-[var(--ink-900)]`}
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
          <div className="container mx-auto">{children}</div>
        </main>
        <SiteFooter />
        <MobileBottomNav />
        <DevStatus />
      </body>
    </html>
  );

  return enableAuth ? <ClerkProvider>{content}</ClerkProvider> : content;
}
