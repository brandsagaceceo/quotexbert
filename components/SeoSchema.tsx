'use client';

interface SeoSchemaProps {
  pageType: 'LocalService' | 'LocalBusiness' | 'SoftwareApplication';
  title: string;
  description: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export function SeoSchema({ pageType, title, description, breadcrumbs }: SeoSchemaProps) {
  const graph: Record<string, unknown>[] = [];

  if (pageType === 'LocalService') {
    graph.push({
      '@type': 'Service',
      name: title,
      description,
      serviceType: 'Home Renovation Estimates',
      provider: {
        '@id': 'https://www.quotexbert.com/#organization',
      },
      areaServed: {
        '@type': 'City',
        name: 'Toronto',
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: 'Ontario, Canada',
        },
      },
    });
  }

  if (breadcrumbs) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url.replace(/^https:\/\/quotexbert\.com/, 'https://www.quotexbert.com'),
      })),
    });
  }

  if (graph.length === 0) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      data-schema="quotexbert-page"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': graph,
        }),
      }}
    />
  );
}
