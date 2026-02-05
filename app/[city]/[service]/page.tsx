import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircleIcon, MapPinIcon, ClockIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

// Define supported cities and services
const CITIES = {
  'toronto': { name: 'Toronto', region: 'Downtown Toronto' },
  'scarborough': { name: 'Scarborough', region: 'East Toronto' },
  'ajax': { name: 'Ajax', region: 'Durham Region' },
  'pickering': { name: 'Pickering', region: 'Durham Region' },
  'whitby': { name: 'Whitby', region: 'Durham Region' },
  'oshawa': { name: 'Oshawa', region: 'Durham Region' },
  'markham': { name: 'Markham', region: 'York Region' },
  'vaughan': { name: 'Vaughan', region: 'York Region' },
  'mississauga': { name: 'Mississauga', region: 'Peel Region' },
  'brampton': { name: 'Brampton', region: 'Peel Region' },
};

const SERVICES = {
  'drywall-repair': {
    name: 'Drywall Repair',
    description: 'Professional drywall hole and crack repair services',
    priceRange: { low: 150, high: 450 },
    duration: '1-3 hours',
    includes: [
      'Hole patching and repair',
      'Crack filling and smoothing',
      'Texture matching',
      'Paint touch-up',
      'Cleanup and disposal'
    ],
    faqs: [
      { q: 'How much does drywall repair cost?', a: 'Small repairs typically range from $150-$250, while larger repairs can cost $300-$450 depending on size and complexity.' },
      { q: 'How long does drywall repair take?', a: 'Most repairs are completed in 1-3 hours, but drying time may add 24-48 hours before painting.' },
      { q: 'Do I need to paint after repair?', a: 'Professional repairs include paint matching and touch-up for seamless results.' }
    ]
  },
  'bathroom-renovation': {
    name: 'Bathroom Renovation',
    description: 'Complete bathroom remodeling and upgrade services',
    priceRange: { low: 8000, high: 25000 },
    duration: '2-4 weeks',
    includes: [
      'Design consultation',
      'Tile and flooring',
      'Vanity and fixtures',
      'Plumbing updates',
      'Electrical work',
      'Painting and finishing'
    ],
    faqs: [
      { q: 'How much does a bathroom renovation cost?', a: 'Basic renovations start around $8,000-$12,000, while high-end remodels can exceed $25,000 depending on size and finishes.' },
      { q: 'How long does a bathroom renovation take?', a: 'Most bathroom renovations take 2-4 weeks from start to finish.' },
      { q: 'Do I need permits?', a: 'Major plumbing or structural work typically requires permits, which your contractor will handle.' }
    ]
  },
  'kitchen-renovation': {
    name: 'Kitchen Renovation',
    description: 'Custom kitchen remodeling and cabinet installation',
    priceRange: { low: 15000, high: 50000 },
    duration: '3-8 weeks',
    includes: [
      'Cabinet installation or refacing',
      'Countertop replacement',
      'Backsplash tile work',
      'Appliance installation',
      'Plumbing and electrical',
      'Flooring updates'
    ],
    faqs: [
      { q: 'How much does a kitchen renovation cost?', a: 'Mid-range renovations typically cost $20,000-$35,000, while luxury kitchens can exceed $50,000.' },
      { q: 'How long does it take?', a: 'Kitchen renovations usually take 4-8 weeks depending on scope and material availability.' },
      { q: 'Can I use my kitchen during renovation?', a: 'Partial access may be possible, but expect limited functionality during major work.' }
    ]
  },
  'roof-repair': {
    name: 'Roof Repair',
    description: 'Residential roof repair and leak fixes',
    priceRange: { low: 300, high: 1500 },
    duration: '3-8 hours',
    includes: [
      'Leak detection and repair',
      'Shingle replacement',
      'Flashing repair',
      'Vent and chimney sealing',
      'Warranty on repairs'
    ],
    faqs: [
      { q: 'How much does roof repair cost?', a: 'Minor repairs cost $300-$600, while extensive damage can reach $1,000-$1,500.' },
      { q: 'How long do repairs take?', a: 'Most roof repairs are completed in 3-8 hours.' },
      { q: 'Is a full replacement needed?', a: 'Our AI estimate will help determine if repair or replacement is more cost-effective.' }
    ]
  },
  'flooring-installation': {
    name: 'Flooring Installation',
    description: 'Hardwood, laminate, and tile flooring installation',
    priceRange: { low: 2000, high: 8000 },
    duration: '2-5 days',
    includes: [
      'Old flooring removal',
      'Subfloor preparation',
      'New flooring installation',
      'Trim and baseboards',
      'Cleanup and finishing'
    ],
    faqs: [
      { q: 'How much does flooring installation cost?', a: 'Costs range from $3-$12 per sq ft installed, depending on material choice.' },
      { q: 'How long does installation take?', a: 'Most rooms take 2-3 days, while whole-home projects may need 5-7 days.' },
      { q: 'Can I walk on it right away?', a: 'Laminate and tile need 24-48 hours; hardwood needs 3-7 days to cure.' }
    ]
  },
  'painting-interior': {
    name: 'Interior Painting',
    description: 'Professional interior painting services',
    priceRange: { low: 800, high: 3500 },
    duration: '2-4 days',
    includes: [
      'Surface preparation',
      'Trim and ceiling painting',
      'Two coats premium paint',
      'Furniture protection',
      'Complete cleanup'
    ],
    faqs: [
      { q: 'How much does interior painting cost?', a: 'Single rooms start at $400-$800, while whole homes range $2,000-$5,000.' },
      { q: 'How long does painting take?', a: 'Most rooms take 1-2 days including drying time.' },
      { q: 'Do I need to move furniture?', a: 'Painters will move and protect furniture, but clearing the room helps speed up work.' }
    ]
  },
  'basement-renovation': {
    name: 'Basement Renovation',
    description: 'Complete basement finishing and remodeling',
    priceRange: { low: 25000, high: 75000 },
    duration: '4-12 weeks',
    includes: [
      'Framing and insulation',
      'Drywall and painting',
      'Flooring installation',
      'Electrical and lighting',
      'Plumbing (if needed)',
      'Permits and inspections'
    ],
    faqs: [
      { q: 'How much does basement renovation cost?', a: 'Basic finishes cost $25-$40 per sq ft, while high-end builds reach $60-$100+ per sq ft.' },
      { q: 'How long does it take?', a: 'Full basement renovations typically take 6-12 weeks.' },
      { q: 'Do I need permits?', a: 'Yes, basement renovations require building permits in most GTA municipalities.' }
    ]
  },
  'electrical-work': {
    name: 'Electrical Work',
    description: 'Licensed electrical repairs and installations',
    priceRange: { low: 200, high: 2000 },
    duration: '2-8 hours',
    includes: [
      'Outlet and switch installation',
      'Lighting fixture installation',
      'Panel upgrades',
      'Code compliance',
      'ESA inspection coordination'
    ],
    faqs: [
      { q: 'How much does electrical work cost?', a: 'Simple repairs cost $150-$300, while panel upgrades range $1,500-$3,000.' },
      { q: 'Do I need a licensed electrician?', a: 'Yes, all electrical work in Ontario requires a licensed electrician and ESA inspection.' },
      { q: 'How long does it take?', a: 'Most jobs take 2-6 hours, while panel upgrades may need 1-2 days.' }
    ]
  },
  'plumbing-repair': {
    name: 'Plumbing Repair',
    description: 'Licensed plumbing repairs and installations',
    priceRange: { low: 150, high: 1500 },
    duration: '1-4 hours',
    includes: [
      'Leak detection and repair',
      'Fixture installation',
      'Drain cleaning',
      'Pipe replacement',
      'Emergency service available'
    ],
    faqs: [
      { q: 'How much does plumbing repair cost?', a: 'Minor fixes cost $150-$300, while major repairs range $500-$1,500.' },
      { q: 'Is same-day service available?', a: 'Many plumbers offer same-day or emergency service for leaks and urgent issues.' },
      { q: 'Are repairs guaranteed?', a: 'Reputable plumbers offer 1-2 year warranties on parts and labor.' }
    ]
  },
  'deck-building': {
    name: 'Deck Building',
    description: 'Custom deck construction and installation',
    priceRange: { low: 5000, high: 20000 },
    duration: '1-3 weeks',
    includes: [
      'Design and permits',
      'Foundation and framing',
      'Decking installation',
      'Railing and stairs',
      'Staining or sealing'
    ],
    faqs: [
      { q: 'How much does deck building cost?', a: 'Basic decks cost $25-$40 per sq ft, while composite decks range $40-$65 per sq ft.' },
      { q: 'Do I need a permit?', a: 'Yes, decks over 24" height require permits in most GTA municipalities.' },
      { q: 'How long does construction take?', a: 'Most decks are completed in 1-2 weeks weather permitting.' }
    ]
  },
};

type Props = {
  params: Promise<{
    city: string;
    service: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, service } = await params;
  
  const cityData = CITIES[city as keyof typeof CITIES];
  const serviceData = SERVICES[service as keyof typeof SERVICES];
  
  if (!cityData || !serviceData) {
    return {
      title: 'Page Not Found | QuoteXbert',
    };
  }

  return {
    title: `${serviceData.name} Cost in ${cityData.name} | QuoteXbert`,
    description: `Get instant ${serviceData.name.toLowerCase()} cost estimates in ${cityData.name}. Average cost: $${serviceData.priceRange.low.toLocaleString()} - $${serviceData.priceRange.high.toLocaleString()}. Free AI-powered quotes in 30 seconds.`,
    openGraph: {
      title: `${serviceData.name} Cost in ${cityData.name}`,
      description: `${serviceData.description}. Get your free estimate now.`,
    },
  };
}

export async function generateStaticParams() {
  const cities = Object.keys(CITIES);
  const services = Object.keys(SERVICES);
  
  return cities.flatMap(city =>
    services.map(service => ({
      city,
      service,
    }))
  );
}

export default async function LocalServicePage({ params }: Props) {
  const { city, service } = await params;
  
  const cityData = CITIES[city as keyof typeof CITIES];
  const serviceData = SERVICES[service as keyof typeof SERVICES];
  
  if (!cityData || !serviceData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-rose-50 to-orange-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link href={`/${city}`} className="hover:text-blue-600 capitalize">{cityData.name}</Link>
            <span>/</span>
            <span className="text-gray-900">{serviceData.name}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            {serviceData.name} Cost in {cityData.name}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            {serviceData.description} in {cityData.name} and {cityData.region}
          </p>

          <div className="flex flex-wrap items-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-rose-700" />
              <span className="text-gray-700">{cityData.name}, ON</span>
            </div>
            <div className="flex items-center gap-2">
              <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">
                ${serviceData.priceRange.low.toLocaleString()} - ${serviceData.priceRange.high.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-orange-600" />
              <span className="text-gray-700">{serviceData.duration}</span>
            </div>
          </div>

          <a
            href="/#get-estimate"
            className="inline-block px-8 py-4 bg-gradient-to-r from-rose-700 to-orange-600 text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
          >
            🚀 Get Free Instant Estimate
          </a>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            What's Included in {serviceData.name}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {serviceData.includes.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Details */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {serviceData.name} Pricing in {cityData.name}
          </h2>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-black text-green-600 mb-2">
                  ${serviceData.priceRange.low.toLocaleString()}
                </div>
                <div className="text-gray-600">Starting From</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-rose-700 mb-2">
                  ${Math.round((serviceData.priceRange.low + serviceData.priceRange.high) / 2).toLocaleString()}
                </div>
                <div className="text-gray-600">Average Cost</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-orange-600 mb-2">
                  ${serviceData.priceRange.high.toLocaleString()}
                </div>
                <div className="text-gray-600">Premium Range</div>
              </div>
            </div>
            <p className="text-gray-700 text-center">
              Prices include materials, labor, and cleanup. Final cost depends on project size, materials chosen, and site conditions.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {serviceData.faqs.map((faq, index) => (
              <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {faq.q}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-rose-700 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready to Get Your Free Estimate?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Upload photos or describe your {serviceData.name.toLowerCase()} project in {cityData.name}. Get detailed pricing in 30 seconds.
          </p>
          <a
            href="/#get-estimate"
            className="inline-block px-10 py-5 bg-white text-rose-700 text-xl font-bold rounded-xl shadow-2xl hover:bg-gray-100 hover:scale-105 transition-all duration-200"
          >
            📸 Get Instant Free Quote
          </a>
          <p className="text-blue-100 mt-4 text-sm">
            No signup required • 100% free for homeowners
          </p>
        </div>
      </section>
    </div>
  );
}
