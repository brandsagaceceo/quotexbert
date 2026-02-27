"use client";

import { useEffect } from 'react';

interface ConversionEvent {
  send_to: string;
  value?: number;
  currency?: string;
  transaction_id?: string;
}

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: any
    ) => void;
  }
}

export function trackContractorSignup(email?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': 'AW-17979635426/contractor_signup',
      'value': 1.0,
      'currency': 'CAD'
    });
    
    // Track in Clarity too
    if ((window as any).clarity) {
      (window as any).clarity('event', 'contractor_signup', { email });
    }
  }
}

export function trackContractorSubscription(tier: string, amount: number, subscriptionId?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': 'AW-17979635426/contractor_subscription',
      'value': amount,
      'currency': 'CAD',
      'transaction_id': subscriptionId || `sub_${Date.now()}`
    });
    
    // Track in Clarity too
    if ((window as any).clarity) {
      (window as any).clarity('event', 'contractor_subscription', { 
        tier, 
        amount 
      });
    }
  }
}

export function trackLeadPurchase(amount: number, leadId?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': 'AW-17979635426/lead_purchase',
      'value': amount,
      'currency': 'CAD',
      'transaction_id': leadId || `lead_${Date.now()}`
    });
    
    if ((window as any).clarity) {
      (window as any).clarity('event', 'lead_purchase', { amount });
    }
  }
}

export function trackPageView(pageName: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      'page_title': pageName,
      'page_location': window.location.href
    });
  }
}

// Component to track page views automatically
export function GoogleAdsPageView({ pageName }: { pageName: string }) {
  useEffect(() => {
    trackPageView(pageName);
  }, [pageName]);

  return null;
}
