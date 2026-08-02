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
  description = "AI-assisted renovation estimate platform connecting homeowners with local contractors.",
  url = "https://www.quotexbert.com",
  city = "Toronto",
  serviceName,
  articleTitle,
  articleDate,
  articleDescription,
}: OrganizationSchemaProps) {
  if (type === "Organization" || type === "LocalBusiness") {
    return null;
  }

  const canonicalUrl = url.replace(/^https:\/\/quotexbert\.com/, "https://www.quotexbert.com");
  let schema: Record<string, unknown>;

  if (type === "Service") {
    schema = {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: serviceName || "Home Renovation",
      provider: {
        "@id": "https://www.quotexbert.com/#organization",
      },
      areaServed: {
        "@type": "City",
        name: city,
        containedInPlace: {
          "@type": "State",
          name: "Ontario",
        },
      },
      description,
      url: canonicalUrl,
    };
  } else {
    schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: articleTitle,
      description: articleDescription || description,
      ...(articleDate ? { datePublished: articleDate } : {}),
      author: {
        "@id": "https://www.quotexbert.com/#organization",
      },
      publisher: {
        "@id": "https://www.quotexbert.com/#organization",
      },
      mainEntityOfPage: canonicalUrl,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
