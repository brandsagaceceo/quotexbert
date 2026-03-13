import { Metadata } from "next";
import { tradeJobPages } from "@/lib/seo/trade-job-data";
import { ContractorLeadData } from "@/lib/seo/contractor-lead-data";
import ContractorLeadTemplate from "@/components/seo/ContractorLeadTemplate";

const rawData = tradeJobPages.find((p) => p.slug === "bathroom-renovation-jobs-toronto")!;
// TradeJobData is structurally identical to ContractorLeadData  reuse template
const data = rawData as unknown as ContractorLeadData;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: rawData.metaTitle,
    description: rawData.metaDescription,
    keywords: rawData.keywords,
    alternates: { canonical: "https://www.quotexbert.com/bathroom-renovation-jobs-toronto" },
    openGraph: {
      title: rawData.metaTitle,
      description: rawData.metaDescription,
      url: "https://www.quotexbert.com/bathroom-renovation-jobs-toronto",
      type: "website",
    },
  };
}

export default function Page() {
  return <ContractorLeadTemplate data={data} />;
}
