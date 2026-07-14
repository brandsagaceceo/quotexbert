import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getTradeData,
  ALL_TRADE_SLUGS,
} from "@/lib/seo/contractor-acquisition-data";
import { TradeLeadPageTemplate } from "@/components/seo/ContractorAcquisitionTemplates";

interface Props {
  params: { trade: string };
}

export async function generateStaticParams() {
  return ALL_TRADE_SLUGS.map((trade) => ({ trade }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = getTradeData(params.trade);
  if (!data) return {};
  const url = `https://www.quotexbert.com/contractor-leads/trades/${data.slug}`;
  return {
    title: data.title,
    description: data.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: data.title,
      description: data.metaDescription,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.metaDescription,
    },
  };
}

export default function TradeContractorLeadsPage({ params }: Props) {
  const data = getTradeData(params.trade);
  if (!data) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://www.quotexbert.com/contractor-leads/trades/${data.slug}`,
        url: `https://www.quotexbert.com/contractor-leads/trades/${data.slug}`,
        name: data.title,
        description: data.metaDescription,
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.quotexbert.com" },
            { "@type": "ListItem", position: 2, name: "Contractor Leads", item: "https://www.quotexbert.com/contractor-leads" },
            { "@type": "ListItem", position: 3, name: "Trades", item: "https://www.quotexbert.com/contractor-leads/trades" },
            { "@type": "ListItem", position: 4, name: data.name, item: `https://www.quotexbert.com/contractor-leads/trades/${data.slug}` },
          ],
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: data.faqs.map((faq) => ({
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
      <TradeLeadPageTemplate data={data} />
    </>
  );
}
