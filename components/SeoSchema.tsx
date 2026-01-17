'use client';

import { useEffect } from 'react';

interface SeoSchemaProps {
  pageType: 'LocalService' | 'LocalBusiness' | 'SoftwareApplication';
  title: string;
  description: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export function SeoSchema({ pageType, title, description, breadcrumbs }: SeoSchemaProps) {
  useEffect(() => {
    // Remove any existing schema scripts to avoid duplicates
    const existingScripts = document.querySelectorAll('script[data-schema="quotexbert"]');
    existingScripts.forEach((script) => script.remove());

    // Create and inject LocalBusiness schema
    const localBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': 'https://quotexbert.com/#business',
      'name': 'QuoteXbert',
      'url': 'https://quotexbert.com',
      'description': 'AI-powered home renovation quotes and contractor matching platform serving Toronto and the Greater Toronto Area',
      'image': 'https://quotexbert.com/logo.png',
      'areaServed': [
        {
          '@type': 'City',
          'name': 'Toronto',
          'state': 'ON',
          'country': 'CA'
        },
        {
          '@type': 'City',
          'name': 'Scarborough',
          'state': 'ON',
          'country': 'CA'
        },
        {
          '@type': 'City',
          'name': 'North York',
          'state': 'ON',
          'country': 'CA'
        },
        {
          '@type': 'City',
          'name': 'Etobicoke',
          'state': 'ON',
          'country': 'CA'
        },
        {
          '@type': 'City',
          'name': 'Mississauga',
          'state': 'ON',
          'country': 'CA'
        }
      ],
      'sameAs': [
        'https://www.facebook.com/quotexbert',
        'https://www.instagram.com/quotexbert',
        'https://www.tiktok.com/@quotexbert',
        'https://x.com/quotexbert',
        'https://www.linkedin.com/company/quotexbert'
      ]
    };

    // Create and inject SoftwareApplication schema
    const softwareSchema = {
      '@context': 'https://schema.org/',
      '@type': 'SoftwareApplication',
      'name': 'QuoteXbert',
      'description': 'AI-powered home renovation estimator for Toronto homeowners',
      'url': 'https://quotexbert.com',
      'applicationCategory': 'BusinessApplication',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'CAD',
        'description': 'Free AI estimates for home renovations'
      },
      'operatingSystem': 'Web',
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.8',
        'ratingCount': '1250',
        'bestRating': '5',
        'worstRating': '1'
      }
    };

    // Create and inject page-specific LocalService schema
    const localServiceSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalService',
      'name': title,
      'description': description,
      'areaServed': {
        '@type': 'City',
        'name': 'Toronto',
        'state': 'ON',
        'country': 'CA'
      },
      'serviceType': 'Home Renovation Estimates',
      'url': typeof window !== 'undefined' ? window.location.href : '',
      'provider': {
        '@type': 'Organization',
        '@id': 'https://quotexbert.com/#business',
        'name': 'QuoteXbert'
      }
    };

    // Create and inject breadcrumb schema if provided
    const breadcrumbSchema = breadcrumbs ? {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': crumb.name,
        'item': crumb.url
      }))
    } : null;

    // Function to create and append script
    const addSchemaScript = (schema: Record<string, unknown>) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', 'quotexbert');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    };

    // Add all schemas
    addSchemaScript(localBusinessSchema);
    addSchemaScript(softwareSchema);
    
    if (pageType === 'LocalService') {
      addSchemaScript(localServiceSchema);
    }
    
    if (breadcrumbSchema) {
      addSchemaScript(breadcrumbSchema);
    }

    return () => {
      // Cleanup
      const scripts = document.querySelectorAll('script[data-schema="quotexbert"]');
      scripts.forEach((script) => script.remove());
    };
  }, [pageType, title, description, breadcrumbs]);

  // This component doesn't render anything visible
  return null;
}
