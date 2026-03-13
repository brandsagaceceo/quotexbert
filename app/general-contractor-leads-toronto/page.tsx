import { Metadata } from "next";
import { contractorLeadPages } from "@/lib/seo/contractor-lead-data";
import ContractorLeadTemplate from "@/components/seo/ContractorLeadTemplate";

const data = contractorLeadPages.find((p) => p.slug === "general-contractor-leads-toronto")!;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    keywords: data.keywords,
    alternates: { canonical: "https://www.quotexbert.com/general-contractor-leads-toronto" },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: "https://www.quotexbert.com/general-contractor-leads-toronto",
      type: "website",
    },
  };
}

export default function Page() {
  return <ContractorLeadTemplate data={data} />;
}
