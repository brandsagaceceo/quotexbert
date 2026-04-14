import { Metadata } from "next";
import { contractorCityPages } from "@/lib/seo/contractor-city-data";
import ContractorCityTemplate from "@/components/seo/ContractorCityTemplate";

const data = contractorCityPages.find((p) => p.slug === "contractor-leads-etobicoke")!;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    keywords: data.keywords,
    alternates: { canonical: "https://www.quotexbert.com/contractor-leads-etobicoke" },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: "https://www.quotexbert.com/contractor-leads-etobicoke",
      type: "website",
    },
  };
}

export default function Page() {
  return <ContractorCityTemplate data={data} />;
}
