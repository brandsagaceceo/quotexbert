import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCityData,
  getTradeData,
  getCityTradeCombo,
  ALL_COMBO_PARAMS,
} from "@/lib/seo/contractor-acquisition-data";
import { CityTradePageTemplate } from "@/components/seo/ContractorAcquisitionTemplates";

interface Props {
  params: Promise<{ city: string; trade: string }>;
}

export async function generateStaticParams() {
  return ALL_COMBO_PARAMS;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, trade } = await params;
  const combo = getCityTradeCombo(city, trade);
  if (!combo) return {};
  const url = `https://www.quotexbert.com/contractor-leads/${city}/${trade}`;
  return {
    title: combo.title,
    description: combo.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: combo.title,
      description: combo.metaDescription,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: combo.title,
      description: combo.metaDescription,
    },
  };
}

export default async function CityTradeContractorLeadsPage({ params }: Props) {
  const { city, trade } = await params;
  const combo = getCityTradeCombo(city, trade);
  const cityData = getCityData(city);
  const tradeData = getTradeData(trade);

  if (!combo || !cityData || !tradeData) notFound();

  const url = `https://www.quotexbert.com/contractor-leads/${city}/${trade}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: combo.title,
        description: combo.metaDescription,
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.quotexbert.com" },
            { "@type": "ListItem", position: 2, name: "Contractor Leads", item: "https://www.quotexbert.com/contractor-leads" },
            { "@type": "ListItem", position: 3, name: cityData.name, item: `https://www.quotexbert.com/contractor-leads/${cityData.slug}` },
            { "@type": "ListItem", position: 4, name: tradeData.name, item: url },
          ],
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: combo.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CityTradePageTemplate combo={combo} cityData={cityData} tradeData={tradeData} />
    </>
  );
}
