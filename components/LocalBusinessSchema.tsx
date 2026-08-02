interface LocalBusinessSchemaProps {
  googleBusinessUrl?: string;
}

export function LocalBusinessSchema(_props: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": "https://www.quotexbert.com/#software",
    name: "QuoteXbert AI Renovation Estimator",
    url: "https://www.quotexbert.com",
    applicationCategory: "HomeAndGardenApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CAD",
    },
    provider: {
      "@id": "https://www.quotexbert.com/#organization",
    },
    isPartOf: {
      "@id": "https://www.quotexbert.com/#website",
    },
  };

  return (
    <script
      id="software-application-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
