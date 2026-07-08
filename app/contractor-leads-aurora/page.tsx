import { Metadata } from "next";
import { contractorCityPages } from "@/lib/seo/contractor-city-data";
import ContractorCityTemplate from "@/components/seo/ContractorCityTemplate";

const data = contractorCityPages.find((p) => p.slug === "contractor-leads-aurora")!;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    keywords: data.keywords,
    alternates: { canonical: "https://www.quotexbert.com/contractor-leads-aurora" },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: "https://www.quotexbert.com/contractor-leads-aurora",
      type: "website",
    },
  };
}

export default function Page() {
  return <ContractorCityTemplate data={data} />;
}
