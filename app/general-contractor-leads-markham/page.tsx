import { Metadata } from "next";
import { contractorCityPages } from "@/lib/seo/contractor-city-data";
import ContractorCityTemplate from "@/components/seo/ContractorCityTemplate";

const data = contractorCityPages.find((p) => p.slug === "general-contractor-leads-markham")!;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    keywords: data.keywords,
    alternates: { canonical: "https://www.quotexbert.com/general-contractor-leads-markham" },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: "https://www.quotexbert.com/general-contractor-leads-markham",
      type: "website",
    },
  };
}

export default function Page() {
  return <ContractorCityTemplate data={data} />;
}
