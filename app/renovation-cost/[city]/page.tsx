import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GTA_CITIES, type CitySlug } from '@/lib/seo/seo-data';
import CityRenovationCostTemplate from '@/components/seo/CityRenovationCostTemplate';

interface PageProps {
  params: { city: string };
}

export async function generateStaticParams() {
  return Object.keys(GTA_CITIES).map((city) => ({ city }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const cityData = GTA_CITIES[params.city as CitySlug];
  if (!cityData) return {};

  const title = `Renovation Costs in ${cityData.name} (2026 Guide) | QuoteXbert`;
  const description = `See real renovation prices for ${cityData.name} homeowners. Kitchen, bathroom, basement & more. Upload a photo and get an AI renovation estimate in seconds.`;
  const url = `https://www.quotexbert.com/renovation-cost/${params.city}`;

  return {
    title,
    description,
    keywords: [
      `${cityData.name} renovation cost`,
      `home renovation ${cityData.name}`,
      `renovation prices ${cityData.name}`,
      `${cityData.name} contractor costs`,
      `${cityData.name} kitchen renovation cost`,
      `${cityData.name} bathroom renovation cost`,
    ],
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'QuoteXbert',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default function CityRenovationCostPage({ params }: PageProps) {
  const cityData = GTA_CITIES[params.city as CitySlug];
  if (!cityData) notFound();

  return (
    <CityRenovationCostTemplate
      cityName={cityData.name}
      citySlug={params.city}
      region={cityData.region}
      description={cityData.description}
      avgHomeCost={cityData.avgHomeCost}
      population={cityData.population}
    />
  );
}
