import { Metadata } from "next";
import { notFound } from "next/navigation";
import { allNeighbourhoodPages } from "@/lib/seo/neighbourhood-data";
import NeighbourhoodTemplate from "@/components/seo/NeighbourhoodTemplate";

const data = allNeighbourhoodPages.find((p) => p.slug === "renovation-estimates-liberty-village");

export async function generateMetadata(): Promise<Metadata> {
  if (!data) return {};
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    keywords: data.keywords,
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: `https://www.quotexbert.com/renovation-estimates-liberty-village`,
      siteName: "QuoteXbert",
      type: "website",
      locale: "en_CA",
    },
    alternates: { canonical: `https://www.quotexbert.com/renovation-estimates-liberty-village` },
  };
}

export default function Page() {
  if (!data) notFound();
  return <NeighbourhoodTemplate data={data} />;
}
