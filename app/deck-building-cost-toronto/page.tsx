import { Metadata } from "next";
import { renovationCostPages } from "@/lib/seo/renovation-cost-data";
import RenovationCostTemplate from "@/components/seo/RenovationCostTemplate";

const page = renovationCostPages.find((p) => p.slug === "deck-building-cost-toronto")!;

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.metaDescription,
  keywords: page.keywords,
  openGraph: {
    title: page.metaTitle,
    description: page.metaDescription,
    url: `https://www.quotexbert.com/deck-building-cost-toronto`,
    siteName: "QuoteXbert",
    type: "website",
    locale: "en_CA",
  },
  alternates: { canonical: `https://www.quotexbert.com/deck-building-cost-toronto` },
};

export default function Page() {
  return <RenovationCostTemplate page={page} />;
}
