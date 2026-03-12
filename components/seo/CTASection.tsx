import type { FC } from "react";
import Link from "next/link";

interface CTASectionProps {
  heading?: string;
  subtext?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

const CTASection: FC<CTASectionProps> = ({
  heading = "Get Your Free AI Renovation Estimate",
  subtext =
    "Upload a photo of your renovation project and receive an instant AI-powered price estimate. Connect with trusted contractors across Toronto and the GTA.",
  primaryLabel = "📸 Upload a Photo & Get My Estimate",
  primaryHref = "/",
  secondaryLabel = "Browse Renovation Cost Guides",
  secondaryHref = "/blog",
}) => (
  <section className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 md:p-12 text-white shadow-2xl my-12">
    <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
    <p className="text-lg md:text-xl mb-8 opacity-95 max-w-2xl">{subtext}</p>
    <div className="flex flex-col sm:flex-row gap-4">
      <Link
        href={primaryHref}
        className="inline-block bg-white text-teal-700 font-bold px-8 py-4 rounded-xl hover:bg-teal-50 transition-colors shadow-lg text-center"
      >
        {primaryLabel}
      </Link>
      <Link
        href={secondaryHref}
        className="inline-block border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-center"
      >
        {secondaryLabel}
      </Link>
    </div>
  </section>
);

export default CTASection;
