interface FaqItem {
  question: string;
  answer: string;
}

interface SeoJsonLdProps {
  pageType: 'renovation-cost' | 'neighborhood' | 'service';
  title: string;
  description: string;
  url: string;
  cityName?: string;
  serviceName?: string;
  faqs?: ReadonlyArray<FaqItem>;
  priceRange?: string;
}

export default function SeoJsonLd({
  pageType,
  title,
  description,
  url,
  cityName,
  serviceName,
  faqs,
  priceRange,
}: SeoJsonLdProps) {
  const schemas: object[] = [];

  // LocalBusiness schema
  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://www.quotexbert.com/#business',
    name: 'QuoteXbert',
    url: 'https://www.quotexbert.com',
    description:
      'AI-powered home renovation quotes and contractor matching platform serving Toronto and the Greater Toronto Area.',
    image: 'https://www.quotexbert.com/logo.png',
    telephone: '',
    areaServed: [
      { '@type': 'City', name: 'Toronto', containedInPlace: { '@type': 'Province', name: 'Ontario' } },
      { '@type': 'City', name: 'Mississauga', containedInPlace: { '@type': 'Province', name: 'Ontario' } },
      { '@type': 'City', name: 'Brampton', containedInPlace: { '@type': 'Province', name: 'Ontario' } },
      { '@type': 'City', name: 'Markham', containedInPlace: { '@type': 'Province', name: 'Ontario' } },
      { '@type': 'City', name: 'Vaughan', containedInPlace: { '@type': 'Province', name: 'Ontario' } },
      { '@type': 'City', name: 'Ajax', containedInPlace: { '@type': 'Province', name: 'Ontario' } },
    ],
    sameAs: [
      'https://www.facebook.com/quotexbert',
      'https://www.instagram.com/quotexbert',
    ],
  };
  schemas.push(localBusiness);

  // Service schema (when service name is provided)
  if (serviceName && cityName) {
    const serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `${serviceName} in ${cityName}`,
      description,
      provider: {
        '@type': 'LocalBusiness',
        name: 'QuoteXbert',
        url: 'https://www.quotexbert.com',
      },
      areaServed: { '@type': 'City', name: cityName, containedInPlace: { '@type': 'Province', name: 'Ontario' } },
      ...(priceRange ? { offers: { '@type': 'Offer', description: priceRange, priceCurrency: 'CAD' } } : {}),
    };
    schemas.push(serviceSchema);
  }

  // FAQ schema
  if (faqs && faqs.length > 0) {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };
    schemas.push(faqSchema);
  }

  // BreadcrumbList
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.quotexbert.com' },
      ...(pageType === 'neighborhood'
        ? [
            { '@type': 'ListItem', position: 2, name: 'Contractors', item: 'https://www.quotexbert.com/contractors' },
            { '@type': 'ListItem', position: 3, name: title, item: url },
          ]
        : pageType === 'renovation-cost'
          ? [
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Renovation Costs',
                item: 'https://www.quotexbert.com/renovation-cost/toronto',
              },
              { '@type': 'ListItem', position: 3, name: title, item: url },
            ]
          : [{ '@type': 'ListItem', position: 2, name: title, item: url }]),
    ],
  };
  schemas.push(breadcrumb);

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
