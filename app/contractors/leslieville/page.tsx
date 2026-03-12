import { Metadata } from 'next';
import { TORONTO_NEIGHBORHOODS } from '@/lib/seo/seo-data';
import NeighborhoodContractorTemplate from '@/components/seo/NeighborhoodContractorTemplate';

const n = TORONTO_NEIGHBORHOODS['leslieville'];

export const metadata: Metadata = {
  title: `Best Contractors in ${n.name}, Toronto | QuoteXbert`,
  description: `Find trusted renovation contractors in ${n.name}, Toronto. Get an instant AI estimate for your kitchen, bathroom, or basement renovation project.`,
  keywords: [`${n.name} contractors`, `renovations ${n.name}`, `${n.name} renovation cost`, `contractors East Toronto`],
  openGraph: {
    title: `Best Contractors in ${n.name}, Toronto | QuoteXbert`,
    description: `Find trusted renovation contractors in ${n.name}. Get an instant AI renovation estimate.`,
    url: `https://www.quotexbert.com/contractors/leslieville`,
    type: 'website',
    siteName: 'QuoteXbert',
  },
  alternates: { canonical: `https://www.quotexbert.com/contractors/leslieville` },
};

export default function LeslievilleContractorsPage() {
  return (
    <NeighborhoodContractorTemplate
      neighborhoodName={n.name}
      city={n.city}
      region={n.region}
      character={n.character}
      description={n.description}
      commonRenovations={n.commonRenovations}
      popularProjects={n.popularProjects}
      avgPriceRange={n.avgPriceRange}
      canonicalUrl="/contractors/leslieville"
    />
  );
}
