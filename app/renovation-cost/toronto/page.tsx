import { Metadata } from 'next';
import { GTA_CITIES } from '@/lib/seo/seo-data';
import CityRenovationCostTemplate from '@/components/seo/CityRenovationCostTemplate';

export const metadata: Metadata = {
  title: 'Renovation Costs in Toronto (2026 Guide) | QuoteXbert',
  description:
    'Complete 2026 renovation cost guide for Toronto homeowners. Kitchen, bathroom, basement, deck & more. Upload a photo and get an instant AI estimate.',
  keywords: [
    'Toronto renovation cost',
    'home renovation Toronto',
    'renovation prices Toronto',
    'Toronto contractor costs 2026',
    'Toronto kitchen renovation cost',
    'Toronto bathroom renovation cost',
    'Toronto basement finishing cost',
  ],
  openGraph: {
    title: 'Renovation Costs in Toronto (2026 Guide) | QuoteXbert',
    description:
      'See real renovation prices for Toronto homeowners. Upload a photo and get an AI renovation estimate in seconds.',
    url: 'https://www.quotexbert.com/renovation-cost/toronto',
    type: 'website',
    siteName: 'QuoteXbert',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Renovation Costs in Toronto (2026 Guide) | QuoteXbert',
    description: 'Real renovation pricing for Toronto homeowners. Get an instant AI estimate.',
  },
  alternates: {
    canonical: 'https://www.quotexbert.com/renovation-cost/toronto',
  },
};

export default function TorontoRenovationCostPage() {
  const cityData = GTA_CITIES.toronto;

  return (
    <CityRenovationCostTemplate
      cityName={cityData.name}
      citySlug="toronto"
      region={cityData.region}
      description={cityData.description}
      avgHomeCost={cityData.avgHomeCost}
      population={cityData.population}
    />
  );
}
