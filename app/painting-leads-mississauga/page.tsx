import { Metadata } from "next";
import { contractorCityPages } from "@/lib/seo/contractor-city-data";
import ContractorCityTemplate from "@/components/seo/ContractorCityTemplate";

const data = contractorCityPages.find((p) => p.slug === "painting-leads-mississauga")!;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    keywords: data.keywords,
    alternates: { canonical: "https://www.quotexbert.com/painting-leads-mississauga" },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: "https://www.quotexbert.com/painting-leads-mississauga",
      type: "website",
    },
  };
}

export default function Page() {
  return <ContractorCityTemplate data={data} />;
}
