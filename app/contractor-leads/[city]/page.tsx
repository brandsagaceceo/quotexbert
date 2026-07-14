import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCityData,
  ALL_CITY_SLUGS,
} from "@/lib/seo/contractor-acquisition-data";
import { CityLeadPageTemplate } from "@/components/seo/ContractorAcquisitionTemplates";

interface Props {
  params: { city: string };
}

export async function generateStaticParams() {
  return ALL_CITY_SLUGS.map((city) => ({ city }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = getCityData(params.city);
  if (!data) return {};
  const url = `https://www.quotexbert.com/contractor-leads/${data.slug}`;
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

export default function CityContractorLeadsPage({ params }: Props) {
  const data = getCityData(params.city);
  if (!data) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://www.quotexbert.com/contractor-leads/${data.slug}`,
        url: `https://www.quotexbert.com/contractor-leads/${data.slug}`,
        name: data.title,
        description: data.metaDescription,
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.quotexbert.com" },
            { "@type": "ListItem", position: 2, name: "Contractor Leads", item: "https://www.quotexbert.com/contractor-leads" },
            { "@type": "ListItem", position: 3, name: data.name, item: `https://www.quotexbert.com/contractor-leads/${data.slug}` },
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
      <CityLeadPageTemplate data={data} />
    </>
  );
}
