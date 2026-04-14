import { Metadata } from "next";
import { contractorCityPages } from "@/lib/seo/contractor-city-data";
import ContractorLeadTemplate from "@/components/seo/ContractorLeadTemplate";

const data = contractorCityPages.find((p) => p.slug === "plumber-leads-mississauga")!;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    keywords: data.keywords,
    alternates: { canonical: "https://www.quotexbert.com/plumber-leads-mississauga" },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: "https://www.quotexbert.com/plumber-leads-mississauga",
      type: "website",
    },
  };
}

export default function Page() {
  return <ContractorLeadTemplate data={data} />;
}
