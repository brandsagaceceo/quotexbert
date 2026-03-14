"use client";

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

interface GoogleAnalyticsProps {
  GA_MEASUREMENT_ID?: string | undefined;
  GTM_ID?: string | undefined;
}



export function GoogleAnalytics({ GA_MEASUREMENT_ID, GTM_ID }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track pageviews
  useEffect(() => {
    if (GA_MEASUREMENT_ID && pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('config', GA_MEASUREMENT_ID, {
          page_path: url,
        });
      }
    }
  }, [pathname, searchParams, GA_MEASUREMENT_ID]);

  // Return null if no IDs provided
  if (!GA_MEASUREMENT_ID && !GTM_ID) {
    return null;
  }

  return (
    <>
      {/* Google Analytics */}
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                  cookie_flags: 'SameSite=None;Secure'
                });
              `,
            }}
          />
        </>
      )}

      {/* Google Tag Manager */}
      {GTM_ID && (
        <>
          <Script
            id="google-tag-manager"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `,
            }}
          />
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        </>
      )}
    </>
  );
}

// Helper functions for tracking events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, parameters);
  }
};

export const trackConversion = (conversionType: string, value?: number) => {
  trackEvent('conversion', {
    conversion_type: conversionType,
    value: value,
    currency: 'CAD',
  });
};

// Specific tracking functions for QuoteXbert events
export const trackPhotoUpload = () => {
  trackEvent('photo_upload', {
    event_category: 'engagement',
    event_label: 'Photo Upload Started',
  });
};

export const trackEstimateComplete = (estimateValue?: number) => {
  trackEvent('estimate_complete', {
    event_category: 'conversion',
    event_label: 'Estimate Generated',
    value: estimateValue,
  });
  trackConversion('estimate_complete', estimateValue);
};

export const trackContractorContact = (contractorId?: string) => {
  trackEvent('contractor_contact', {
    event_category: 'conversion',
    event_label: 'Contacted Contractor',
    contractor_id: contractorId,
  });
  trackConversion('contractor_contact');
};

export const trackSignUp = (method: string) => {
  trackEvent('sign_up', {
    method: method,
  });
  trackConversion('sign_up');
};

export const trackCTAClick = (ctaLocation: string, ctaText: string) => {
  trackEvent('cta_click', {
    event_category: 'engagement',
    event_label: ctaText,
    cta_location: ctaLocation,
  });
};

export const trackExitIntent = () => {
  trackEvent('exit_intent_triggered', {
    event_category: 'engagement',
    event_label: 'Exit Intent Modal Shown',
  });
};

export const trackReviewClick = () => {
  trackEvent('review_click', {
    event_category: 'engagement',
    event_label: 'Google Review Clicked',
  });
  trackConversion('review_click');
};

// ── Additional conversion events (Google Ads / GA4 compatible) ───────────────

export const trackEstimateStarted = (source?: string) => {
  trackEvent('estimate_started', {
    event_category: 'conversion',
    source: source ?? 'homepage',
  });
};

export const trackEstimateSubmitted = (source?: string) => {
  trackEvent('estimate_submitted', {
    event_category: 'conversion',
    source: source ?? 'homepage',
  });
};

export const trackSecondOpinionStarted = () => {
  trackEvent('second_opinion_started', { event_category: 'conversion' });
};

export const trackSecondOpinionCompleted = (verdict?: string) => {
  trackEvent('second_opinion_completed', {
    verdict: verdict ?? 'unknown',
    event_category: 'conversion',
    event_label: 'Second Opinion Generated',
  });
  trackConversion('second_opinion_completed');
};

export const trackSignUpModalShown = (trigger?: string) => {
  trackEvent('sign_up_modal_shown', {
    trigger: trigger ?? 'gate',
    event_category: 'auth',
  });
};

/**
 * User clicks any "Create Account" / "Sign Up" CTA.
 * ← Wire Google Ads conversion tag here:
 *   gtag('event', 'conversion', { send_to: 'AW-17979635426/XXXXXXXX' })
 */
export const trackCreateAccountClicked = (location?: string) => {
  trackEvent('create_account_clicked', {
    location: location ?? 'unknown',
    event_category: 'auth',
  });
  trackConversion('create_account_clicked');
};

/**
 * Contractor clicks "Join" CTA.
 * ← Wire Google Ads conversion tag here.
 */
export const trackContractorJoinClicked = (location?: string) => {
  trackEvent('contractor_join_clicked', {
    location: location ?? 'unknown',
    event_category: 'acquisition',
  });
  trackConversion('contractor_join_clicked');
};

export const trackContactSupportClicked = (method?: string) => {
  trackEvent('contact_support_clicked', {
    method: method ?? 'page',
    event_category: 'support',
  });
};
