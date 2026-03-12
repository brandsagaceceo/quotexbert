import Link from 'next/link';
import { INTERNAL_LINKS } from '@/lib/seo/seo-data';
import SeoJsonLd from '@/components/seo/SeoJsonLd';

interface PriceRange {
  label: string;
  range: string;
  desc: string;
}

interface PriceRanges {
  basic: PriceRange;
  mid: PriceRange;
  high: PriceRange;
}

interface RenovationCostTemplateProps {
  cityName: string;
  renovationType: string;
  emoji: string;
  h1: string;
  intro: string;
  priceRanges: PriceRanges;
  costFactors: readonly string[];
  faqs: ReadonlyArray<{ question: string; answer: string }>;
  canonicalUrl: string;
  relatedLinks?: ReadonlyArray<{ href: string; label: string }>;
}

export default function RenovationCostTemplate({
  cityName,
  renovationType,
  emoji,
  h1,
  intro,
  priceRanges,
  costFactors,
  faqs,
  canonicalUrl,
  relatedLinks,
}: RenovationCostTemplateProps) {
  const defaultRelatedLinks = [
    INTERNAL_LINKS.kitchenRenovation,
    INTERNAL_LINKS.bathroomRenovation,
    INTERNAL_LINKS.basementFinishing,
    INTERNAL_LINKS.contractorDirectory,
  ].filter((l) => l.href !== canonicalUrl);

  const links = relatedLinks ?? defaultRelatedLinks;

  return (
    <>
      <SeoJsonLd
        pageType="service"
        title={h1}
        description={`${renovationType} cost guide for ${cityName} homeowners.`}
        url={`https://www.quotexbert.com${canonicalUrl}`}
        cityName={cityName}
        serviceName={renovationType}
        faqs={faqs as ReadonlyArray<{ question: string; answer: string }>}
        priceRange={`${priceRanges.basic.range} – ${priceRanges.high.range}`}
      />
      <div className="min-h-screen bg-white">
      {/* Hero */}
      <header className="bg-gradient-to-r from-rose-600 to-orange-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="text-sm mb-6 opacity-80">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            {' / '}
            <Link href="/renovation-cost/toronto" className="hover:underline">
              Renovation Costs
            </Link>
            {' / '}
            <span>
              {renovationType} in {cityName}
            </span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">{h1}</h1>
          <p className="text-xl opacity-90 mb-8">{intro}</p>
          <Link
            href="/"
            className="inline-block bg-white text-rose-600 font-bold px-8 py-4 rounded-xl hover:bg-rose-50 transition-colors shadow-lg text-lg"
          >
            📸 Upload Photo &amp; Get Free Estimate
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-14">
        {/* Price ranges */}
        <section>
          <h2 className="text-3xl font-black text-slate-900 mb-6">
            {emoji} {renovationType} Cost in {cityName}: 2026 Price Ranges
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { tier: priceRanges.basic, color: 'border-blue-200 bg-blue-50', textColor: 'text-blue-700' },
              {
                tier: priceRanges.mid,
                color: 'border-rose-300 bg-rose-50',
                textColor: 'text-rose-700',
              },
              { tier: priceRanges.high, color: 'border-amber-200 bg-amber-50', textColor: 'text-amber-700' },
            ].map(({ tier, color, textColor }) => (
              <div key={tier.label} className={`rounded-2xl p-6 border-2 ${color}`}>
                <p className="text-sm font-semibold text-slate-600 mb-2">{tier.label}</p>
                <p className={`text-2xl font-black ${textColor} mb-2`}>{tier.range}</p>
                <p className="text-sm text-slate-600">{tier.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-gradient-to-r from-rose-600 to-orange-500 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-black mb-3">
            Get an Instant {renovationType} Estimate for Your {cityName} Home
          </h2>
          <p className="text-lg opacity-90 mb-6">
            Upload a photo or describe your project. Our AI gives you a real price range based on current{' '}
            {cityName} market rates — in seconds.
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-rose-600 font-bold px-8 py-3 rounded-xl hover:bg-rose-50 transition-colors shadow-md"
          >
            📸 Get My Free Estimate →
          </Link>
        </section>

        {/* Cost factors */}
        <section>
          <h2 className="text-3xl font-black text-slate-900 mb-4">
            What Affects the Cost of {renovationType} in {cityName}?
          </h2>
          <p className="text-lg text-slate-700 mb-6">
            Several factors influence your final renovation price. Understanding these helps you budget accurately
            and ask the right questions when getting contractor quotes.
          </p>
          <ul className="space-y-3">
            {costFactors.map((factor) => (
              <li key={factor} className="flex items-start gap-3">
                <span className="text-rose-500 text-xl mt-0.5">✓</span>
                <span className="text-slate-700">{factor}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Why QuoteXbert */}
        <section className="bg-slate-50 rounded-2xl p-8">
          <h2 className="text-2xl font-black text-slate-900 mb-4">
            Why {cityName} Homeowners Use QuoteXbert
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '⚡', title: 'Instant AI Estimate', desc: 'Get a price range in seconds, not days.' },
              { icon: '🎯', title: 'Know Fair Pricing', desc: "See if a contractor's quote is reasonable before you sign." },
              { icon: '📸', title: 'Photo-Based Quotes', desc: 'Upload a photo and describe your project for accuracy.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-3xl font-black text-slate-900 mb-6">
            Frequently Asked Questions: {renovationType} in {cityName}
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="border-l-4 border-rose-400 pl-6">
                <h3 className="font-bold text-slate-900 text-lg mb-2">{faq.question}</h3>
                <p className="text-slate-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Internal links */}
        <section className="border-t border-slate-200 pt-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Explore More Renovation Cost Guides</h2>
          <div className="flex flex-wrap gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-block bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-medium px-4 py-2 rounded-lg transition-colors text-sm"
              >
                {link.label} →
              </Link>
            ))}
            <Link
              href="/"
              className="inline-block bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Get Free AI Estimate →
            </Link>
          </div>
        </section>
      </main>
    </div>
    </>
  );
}
