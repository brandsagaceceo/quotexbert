import Script from 'next/script';

interface LocalBusinessSchemaProps {
  googleBusinessUrl?: string;
}

export function LocalBusinessSchema({ googleBusinessUrl }: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": "QuoteXbert",
    "description": "AI-powered instant home renovation estimates connecting homeowners with verified contractors in Toronto and the Greater Toronto Area",
    "image": "https://www.quotexbert.com/og-image.jpg",
    "@id": "https://www.quotexbert.com",
    "url": "https://www.quotexbert.com",
    "telephone": "+1-416-XXX-XXXX",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Toronto",
      "addressRegion": "ON",
      "postalCode": "M5H 2N2",
      "addressCountry": "CA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 43.6532,
      "longitude": -79.3832
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Toronto",
        "sameAs": "https://en.wikipedia.org/wiki/Toronto"
      },
      {
        "@type": "City",
        "name": "Oshawa",
        "sameAs": "https://en.wikipedia.org/wiki/Oshawa"
      },
      {
        "@type": "City",
        "name": "Whitby",
        "sameAs": "https://en.wikipedia.org/wiki/Whitby,_Ontario"
      },
      {
        "@type": "City",
        "name": "Ajax",
        "sameAs": "https://en.wikipedia.org/wiki/Ajax,_Ontario"
      },
      {
        "@type": "City",
        "name": "Pickering",
        "sameAs": "https://en.wikipedia.org/wiki/Pickering,_Ontario"
      },
      {
        "@type": "City",
        "name": "Bowmanville",
        "sameAs": "https://en.wikipedia.org/wiki/Bowmanville"
      },
      {
        "@type": "City",
        "name": "Clarington",
        "sameAs": "https://en.wikipedia.org/wiki/Clarington"
      },
      {
        "@type": "State",
        "name": "Durham Region"
      },
      {
        "@type": "State",
        "name": "Greater Toronto Area"
      }
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday"],
        "opens": "10:00",
        "closes": "16:00"
      }
    ],
    "sameAs": googleBusinessUrl ? [
      googleBusinessUrl,
      "https://www.quotexbert.com"
    ] : ["https://www.quotexbert.com"],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "43",
      "bestRating": "5",
      "worstRating": "1"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.quotexbert.com/create-lead?query={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
