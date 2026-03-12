import { Metadata } from 'next';
import { RENOVATION_TYPES, FAQ_DATABASE } from '@/lib/seo/seo-data';
import RenovationCostTemplate from '@/components/seo/RenovationCostTemplate';

const reno = RENOVATION_TYPES['flooring-installation'];

export const metadata: Metadata = {
  title: reno.metaTitle,
  description: reno.metaDescription,
  keywords: [
    'flooring installation cost Toronto',
    'hardwood flooring Toronto',
    'Toronto flooring price 2026',
    'GTA flooring installation cost',
    'laminate flooring Toronto cost',
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

export default function FlooringInstallationCostTorontoPage() {
  return (
    <RenovationCostTemplate
      cityName="Toronto"
      renovationType={reno.name}
      emoji={reno.emoji}
      h1={reno.h1}
      intro={reno.intro}
      priceRanges={reno.priceRanges}
      costFactors={reno.costFactors}
      faqs={FAQ_DATABASE.general}
      canonicalUrl={`/${reno.urlPath}`}
    />
  );
}
