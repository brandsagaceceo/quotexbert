import { Metadata } from 'next';
import { RENOVATION_TYPES, FAQ_DATABASE } from '@/lib/seo/seo-data';
import RenovationCostTemplate from '@/components/seo/RenovationCostTemplate';

const reno = RENOVATION_TYPES['kitchen-renovation'];

export const metadata: Metadata = {
  title: reno.metaTitle,
  description: reno.metaDescription,
  keywords: [
    'kitchen renovation cost Toronto',
    'kitchen remodel Toronto',
    'Toronto kitchen renovation price',
    'GTA kitchen renovation cost 2026',
  ],
  openGraph: {
    title: reno.metaTitle,
    description: reno.metaDescription,
    url: `https://www.quotexbert.com/${reno.urlPath}`,
    type: 'website',
    siteName: 'QuoteXbert',
  },
  twitter: {
    card: 'summary_large_image',
    title: reno.metaTitle,
    description: reno.metaDescription,
  },
  alternates: {
    canonical: `https://www.quotexbert.com/${reno.urlPath}`,
  },
};

export default function KitchenRenovationCostTorontoPage() {
  return (
    <RenovationCostTemplate
      cityName="Toronto"
      renovationType={reno.name}
      emoji={reno.emoji}
      h1={reno.h1}
      intro={reno.intro}
      priceRanges={reno.priceRanges}
      costFactors={reno.costFactors}
      faqs={FAQ_DATABASE.kitchen}
      canonicalUrl={`/${reno.urlPath}`}
    />
  );
}
