// Enhanced Analytics and User Tracking System
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Google Analytics 4 Integration
export const initGA4 = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA4_ID) {
    // Load Google Analytics
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', process.env.NEXT_PUBLIC_GA4_ID);
  }
};

// Custom Event Tracking
export const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
  // Google Analytics tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties);
  }

  // Custom database tracking for detailed analytics
  if (typeof window === 'undefined') {
    // Server-side tracking
    trackCustomEvent(eventName, properties).catch(console.error);
  }
};

// User Behavior Tracking Events
export const trackUserEvents = {
  // Authentication Events
  userSignUp: (userId: string, userType: 'homeowner' | 'contractor') => {
    trackEvent('user_sign_up', { user_id: userId, user_type: userType });
  },

  userLogin: (userId: string, userType: 'homeowner' | 'contractor') => {
    trackEvent('user_login', { user_id: userId, user_type: userType });
  },

  // Job-related Events
  jobCreated: (jobId: string, userId: string, category: string, budget: number) => {
    trackEvent('job_created', { 
      job_id: jobId, 
      user_id: userId, 
      category, 
      budget: budget 
    });
  },

  jobApplied: (jobId: string, contractorId: string) => {
    trackEvent('job_application', { 
      job_id: jobId, 
      contractor_id: contractorId 
    });
  },

  // Payment Events
  paymentInitiated: (amount: number, jobId: string, userId: string) => {
    trackEvent('payment_initiated', { 
      amount, 
      job_id: jobId, 
      user_id: userId 
    });
  },

  paymentCompleted: (amount: number, jobId: string, userId: string) => {
    trackEvent('payment_completed', { 
      amount, 
      job_id: jobId, 
      user_id: userId 
    });
  },

  // Messaging Events
  messagesSent: (fromUserId: string, toUserId: string, jobId?: string) => {
    trackEvent('message_sent', { 
      from_user: fromUserId, 
      to_user: toUserId, 
      job_id: jobId 
    });
  },

  // Portfolio Events
  portfolioViewed: (contractorId: string, viewerId: string) => {
    trackEvent('portfolio_viewed', { 
      contractor_id: contractorId, 
      viewer_id: viewerId 
    });
  },

  // Search Events
  contractorSearch: (searchTerms: any, resultsCount: number, userId: string) => {
    trackEvent('contractor_search', { 
      search_terms: JSON.stringify(searchTerms), 
      results_count: resultsCount, 
      user_id: userId 
    });
  }
};

// Database Event Tracking
async function trackCustomEvent(eventName: string, properties: Record<string, any>) {
  try {
    await prisma.analytics.create({
      data: {
        eventName,
        eventData: properties,
        timestamp: new Date(),
        userId: properties.user_id || null,
        sessionId: properties.session_id || null,
        ipAddress: properties.ip_address || null,
        userAgent: properties.user_agent || null
      }
    });
  } catch (error) {
    console.error('Failed to track custom event:', error);
  }
}

// Page View Tracking
export const trackPageView = (page: string, userId?: string) => {
  trackEvent('page_view', { 
    page_location: page, 
    user_id: userId 
  });
};

// Performance Tracking
export const trackPerformance = (metricName: string, value: number, userId?: string) => {
  trackEvent('performance_metric', { 
    metric_name: metricName, 
    value, 
    user_id: userId 
  });
};

// Error Tracking
export const trackError = (error: Error, context: string, userId?: string) => {
  trackEvent('error_occurred', { 
    error_message: error.message, 
    error_stack: error.stack, 
    context, 
    user_id: userId 
  });
};

// User Session Tracking
export const trackUserSession = {
  start: (userId: string, sessionId: string) => {
    trackEvent('session_start', { user_id: userId, session_id: sessionId });
  },

  end: (userId: string, sessionId: string, duration: number) => {
    trackEvent('session_end', { 
      user_id: userId, 
      session_id: sessionId, 
      duration_seconds: duration 
    });
  }
};

// A/B Testing Support
export const trackABTest = (testName: string, variant: string, userId: string) => {
  trackEvent('ab_test_view', { 
    test_name: testName, 
    variant, 
    user_id: userId 
  });
};

// Conversion Funnel Tracking
export const trackConversionFunnel = {
  step1_visit: (userId?: string) => trackEvent('funnel_visit', { step: 1, user_id: userId }),
  step2_signup: (userId: string) => trackEvent('funnel_signup', { step: 2, user_id: userId }),
  step3_profile: (userId: string) => trackEvent('funnel_profile', { step: 3, user_id: userId }),
  step4_first_action: (userId: string, action: string) => trackEvent('funnel_first_action', { step: 4, user_id: userId, action }),
  step5_payment: (userId: string) => trackEvent('funnel_payment', { step: 5, user_id: userId })
};

// Export analytics initialization
export const initializeAnalytics = () => {
  initGA4();
  
  // Track initial page load
  if (typeof window !== 'undefined') {
    trackPageView(window.location.pathname);
  }
};

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}