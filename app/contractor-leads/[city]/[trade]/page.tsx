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
  params: { city: string; trade: string };
}

export async function generateStaticParams() {
  return ALL_COMBO_PARAMS;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const combo = getCityTradeCombo(params.city, params.trade);
  if (!combo) return {};
  const url = `https://www.quotexbert.com/contractor-leads/${params.city}/${params.trade}`;
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

export default function CityTradeContractorLeadsPage({ params }: Props) {
  const combo = getCityTradeCombo(params.city, params.trade);
  const cityData = getCityData(params.city);
  const tradeData = getTradeData(params.trade);

  if (!combo || !cityData || !tradeData) notFound();

  const url = `https://www.quotexbert.com/contractor-leads/${params.city}/${params.trade}`;

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
