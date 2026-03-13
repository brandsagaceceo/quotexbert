interface OrganizationSchemaProps {
  type: "Organization" | "LocalBusiness" | "Service" | "Article";
  name?: string;
  description?: string;
  url?: string;
  city?: string;
  serviceName?: string;
  articleTitle?: string;
  articleDate?: string;
  articleDescription?: string;
}

export default function StructuredData({
  type,
  name = "QuoteXbert",
  description = "AI-powered renovation estimate platform connecting Toronto homeowners with verified local contractors.",
  url = "https://www.quotexbert.com",
  city = "Toronto",
  serviceName,
  articleTitle,
  articleDate,
  articleDescription,
}: OrganizationSchemaProps) {
  let schema: Record<string, unknown> = {};

  if (type === "Organization") {
    schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name,
      description,
      url,
      logo: `${url}/logo.svg`,
      sameAs: [
        "https://www.facebook.com/quotexbert",
        "https://www.instagram.com/quotexbert",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-416-000-0000",
        contactType: "customer support",
        areaServed: "CA",
        availableLanguage: "English",
      },
    };
  }

  if (type === "LocalBusiness") {
    schema = {
      "@context": "https://schema.org",
      "@type": "HomeAndConstructionBusiness",
      name,
      description,
      url,
      logo: `${url}/logo.svg`,
      image: `${url}/og-image.jpg`,
      address: {
        "@type": "PostalAddress",
        addressLocality: city,
        addressRegion: "ON",
        addressCountry: "CA",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 43.651070,
        longitude: -79.347015,
      },
      areaServed: {
        "@type": "GeoCircle",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: 43.651070,
          longitude: -79.347015,
        },
        geoRadius: "80000",
      },
      priceRange: "$$",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "00:00",
          closes: "23:59",
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "247",
        bestRating: "5",
      },
    };
  }

  if (type === "Service") {
    schema = {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: serviceName || "Home Renovation",
      provider: {
        "@type": "Organization",
        name: "QuoteXbert",
        url,
      },
      areaServed: {
        "@type": "City",
        name: city,
        containedInPlace: {
          "@type": "State",
          name: "Ontario",
        },
      },
      description: description,
      url,
    };
  }

  if (type === "Article") {
    schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: articleTitle,
      description: articleDescription || description,
      datePublished: articleDate || new Date().toISOString(),
      dateModified: new Date().toISOString(),
      author: {
        "@type": "Organization",
        name: "QuoteXbert",
        url,
      },
      publisher: {
        "@type": "Organization",
        name: "QuoteXbert",
        logo: {
          "@type": "ImageObject",
          url: `${url}/logo.svg`,
        },
      },
      mainEntityOfPage: url,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
