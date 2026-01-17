import { Metadata } from 'next';
import Link from 'next/link';
import { SeoSchema } from '@/components/SeoSchema';

export const metadata: Metadata = {
  title: 'Toronto Kitchen Renovation Costs & Quotes | Complete GTA Pricing Guide',
  description: 'Get accurate kitchen renovation quotes for Toronto homes. AI-powered estimates, real GTA pricing, design ideas, and budgeting tips.',
  keywords: 'Toronto kitchen renovation, kitchen remodel Toronto, kitchen costs GTA, Toronto kitchen quotes',
  openGraph: {
    title: 'Toronto Kitchen Renovation Costs & Quotes',
    description: 'Instant AI-powered kitchen renovation estimates for Toronto homeowners.',
    url: 'https://quotexbert.com/toronto-kitchen-renovation',
    type: 'website',
    siteName: 'QuoteXbert',
    images: [
      {
        url: 'https://quotexbert.com/og-kitchen.jpg',
        width: 1200,
        height: 630,
        alt: 'Toronto Kitchen Renovation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toronto Kitchen Renovation Costs & Quotes',
    description: 'AI-powered kitchen renovation estimates for Toronto homeowners.',
    images: ['https://quotexbert.com/og-kitchen.jpg'],
  },
  canonical: 'https://quotexbert.com/toronto-kitchen-renovation',
};

export default function TorontoKitchenRenovationPage() {
  return (
    <>
      <SeoSchema 
        pageType="LocalService"
        title="Toronto Kitchen Renovation"
        description="Accurate kitchen renovation estimates and quotes for Toronto homeowners"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Hero Section */}
          <section className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 leading-tight">
              Toronto Kitchen Renovation Costs: Complete 2025 Pricing & Design Guide
            </h1>
            
            <p className="text-xl text-slate-700 mb-6 leading-relaxed">
              Planning a kitchen renovation in Toronto or the GTA? Discover real pricing for full remodels, cabinet upgrades, and countertop projects. Get an instant AI-powered quote in minutes.
            </p>

            {/* CTA Block */}
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-8 text-white mb-8 shadow-2xl">
              <h2 className="text-3xl font-bold mb-4">Get Your Free Kitchen Renovation Estimate</h2>
              <p className="text-lg mb-6 opacity-95">
                Upload a photo of your current kitchen or describe your vision. Get an instant quote based on Toronto market rates.
              </p>
              <Link
                href="/"
                className="inline-block bg-white text-orange-600 font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                📸 Upload Kitchen Photo & Get Quote
              </Link>
            </div>
          </section>

          {/* Content Sections */}
          <article className="space-y-12">
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How Much Does a Kitchen Renovation Cost in Toronto?</h2>
              <p className="text-lg text-slate-700 leading-relaxed mb-4">
                Kitchen renovations are the biggest home improvement investment for Toronto homeowners. Whether you're in Scarborough, North York, Etobicoke, or downtown, you're looking at a significant project with costs ranging from $15,000 to $50,000+.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed mb-4">
                But here's the truth: most Toronto homeowners don't know what fair pricing looks like. You get three contractor quotes: $20,000, $35,000, and $42,000. No explanation. Just a number. That's where QuoteXbert comes in.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Let's break down what Toronto kitchen renovations actually cost in 2025:
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Toronto Kitchen Renovation Cost Breakdown by Scope</h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 border-2 border-orange-200 shadow-lg">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Minor Kitchen Update</h3>
                  <p className="text-2xl font-bold text-orange-600 mb-4">$10,000 - $15,000</p>
                  <p className="text-slate-700 mb-4 font-semibold">Best for: Fresh paint, new hardware, updated fixtures</p>
                  <ul className="space-y-2 text-slate-700">
                    <li>✓ Cabinet refinishing or repainting</li>
                    <li>✓ New knobs & hardware</li>
                    <li>✓ Fresh paint & lighting</li>
                    <li>✓ Countertop edge work only</li>
                    <li>✓ 2-4 weeks timeline</li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 border-2 border-orange-200 shadow-lg">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Mid-Range Kitchen Renovation</h3>
                  <p className="text-2xl font-bold text-orange-600 mb-4">$20,000 - $35,000</p>
                  <p className="text-slate-700 mb-4 font-semibold">Best for: New cabinets, countertops, appliances, layout improvements</p>
                  <ul className="space-y-2 text-slate-700">
                    <li>✓ New semi-custom cabinetry</li>
                    <li>✓ Laminate or quartz countertops</li>
                    <li>✓ Mid-range appliances</li>
                    <li>✓ Updated backsplash</li>
                    <li>✓ New flooring</li>
                    <li>✓ 6-10 weeks timeline</li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 border-2 border-orange-200 shadow-lg">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Luxury Kitchen Remodel</h3>
                  <p className="text-2xl font-bold text-orange-600 mb-4">$35,000 - $60,000+</p>
                  <p className="text-slate-700 mb-4 font-semibold">Best for: Full custom build-out with high-end finishes</p>
                  <ul className="space-y-2 text-slate-700">
                    <li>✓ Custom cabinetry (wood or soft-close)</li>
                    <li>✓ Premium countertops (granite, marble, quartz)</li>
                    <li>✓ High-end appliances (Bosch, Sub-Zero, Viking)</li>
                    <li>✓ Marble or stone backsplash</li>
                    <li>✓ New plumbing & electrical work</li>
                    <li>✓ Island or peninsula addition</li>
                    <li>✓ 10-14 weeks timeline</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Where Your Kitchen Renovation Budget Goes (The Honest Breakdown)</h2>
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                If you're spending $25,000 on a Toronto kitchen renovation, here's typically how that money is allocated:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-orange-200">
                  <span className="text-slate-700"><strong>Cabinetry</strong> (new or refaced)</span>
                  <span className="font-bold text-orange-600 text-lg">30-40%</span>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-orange-200">
                  <span className="text-slate-700"><strong>Countertops</strong> (material + install)</span>
                  <span className="font-bold text-orange-600 text-lg">15-20%</span>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-orange-200">
                  <span className="text-slate-700"><strong>Appliances</strong> (stove, fridge, dishwasher)</span>
                  <span className="font-bold text-orange-600 text-lg">15-25%</span>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-orange-200">
                  <span className="text-slate-700"><strong>Labor</strong> (installation, plumbing, electrical)</span>
                  <span className="font-bold text-orange-600 text-lg">20-30%</span>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-orange-200">
                  <span className="text-slate-700"><strong>Backsplash, flooring, lighting, misc</strong></span>
                  <span className="font-bold text-orange-600 text-lg">10-15%</span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Popular Kitchen Styles in Toronto & Their Costs</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Modern/Minimalist</h3>
                  <p className="text-slate-700 mb-3">
                    Clean lines, flat-front cabinets, integrated appliances. Popular in Scarborough and North York condos.
                  </p>
                  <p className="text-lg font-bold text-orange-600">$20,000 - $35,000</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Traditional/Classic</h3>
                  <p className="text-slate-700 mb-3">
                    Raised-panel cabinets, warm finishes, island layout. Common in suburban Toronto homes.
                  </p>
                  <p className="text-lg font-bold text-orange-600">$22,000 - $40,000</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Farmhouse/Rustic</h3>
                  <p className="text-slate-700 mb-3">
                    Open shelving, natural wood, vintage fixtures. Great for transitional Toronto homes.
                  </p>
                  <p className="text-lg font-bold text-orange-600">$20,000 - $38,000</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Industrial/Contemporary</h3>
                  <p className="text-slate-700 mb-3">
                    Exposed brick, stainless steel, concrete. Popular in downtown Toronto lofts.
                  </p>
                  <p className="text-lg font-bold text-orange-600">$25,000 - $45,000</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Kitchen Renovation Mistakes That Cost Toronto Homeowners Thousands</h2>
              <div className="space-y-4">
                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                  <h3 className="font-bold text-red-900 mb-2">❌ Choosing cabinets before finalizing layout</h3>
                  <p className="text-slate-700">Your kitchen layout determines cabinet needs. Changing it after ordering costs 15-30% more.</p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                  <h3 className="font-bold text-red-900 mb-2">❌ Not budgeting for electrical & plumbing upgrades</h3>
                  <p className="text-slate-700">Most Toronto homes need electrical panel upgrades or added outlets. Budget $2,000-5,000 for this.</p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                  <h3 className="font-bold text-red-900 mb-2">❌ Underestimating appliance costs</h3>
                  <p className="text-slate-700">Mid-range appliances ($1,500-3,000 each) quickly add up. A full set can cost $6,000-10,000.</p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                  <h3 className="font-bold text-red-900 mb-2">❌ Forgetting about contingency funds</h3>
                  <p className="text-slate-700">Add 15-20% buffer. Toronto homes often reveal surprises (outdated wiring, water damage, structural issues).</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Kitchen Renovation Timeline for Toronto Homes</h2>
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Most Toronto kitchen renovations follow this timeline:
              </p>
              
              <ul className="space-y-4 text-slate-700">
                <li className="flex items-start gap-4">
                  <span className="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">1-2</span>
                  <div>
                    <strong className="text-slate-900">Planning & Design (1-2 weeks)</strong>
                    <p className="text-sm">Meetings with designer/contractor, material selection, permit applications</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">1-2</span>
                  <div>
                    <strong className="text-slate-900">Permits & Approvals (1-2 weeks)</strong>
                    <p className="text-sm">City of Toronto building permit processing</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">2-3</span>
                  <div>
                    <strong className="text-slate-900">Demo & Prep (2-3 days)</strong>
                    <p className="text-sm">Removing old kitchen, inspecting framing & structure</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">1-2</span>
                  <div>
                    <strong className="text-slate-900">Rough Work (1-2 weeks)</strong>
                    <p className="text-sm">Plumbing, electrical, gas lines updated if needed</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">2-3</span>
                  <div>
                    <strong className="text-slate-900">Cabinet & Finish Work (2-3 weeks)</strong>
                    <p className="text-sm">Cabinets installed, countertops, backsplash, flooring</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold flex-shrink-0">3-5</span>
                  <div>
                    <strong className="text-slate-900">Appliance Install & Finishing (3-5 days)</strong>
                    <p className="text-sm">Appliances installed, final trim work, inspection</p>
                  </div>
                </li>
              </ul>
              
              <p className="text-slate-700 mt-6 font-semibold">
                <strong>Total timeline:</strong> 6-10 weeks from start to finish for mid-range renovations
              </p>
            </section>

            {/* Internal Links */}
            <section className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-8 border border-orange-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Explore More Toronto Renovation Topics</h2>
              <p className="text-slate-700 mb-6">
                Get quotes and information for other Toronto renovation projects:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  href="/toronto-renovation-quotes"
                  className="inline-block bg-white text-orange-600 font-bold px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors border border-orange-300 shadow"
                >
                  → General Toronto Renovation Quotes
                </Link>
                <Link
                  href="/toronto-bathroom-renovation"
                  className="inline-block bg-white text-orange-600 font-bold px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors border border-orange-300 shadow"
                >
                  → Toronto Bathroom Renovation Costs
                </Link>
              </div>
            </section>

            {/* Final CTA */}
            <section className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-8 text-white text-center shadow-2xl">
              <h2 className="text-3xl font-bold mb-4">Get Your Toronto Kitchen Renovation Quote Today</h2>
              <p className="text-lg mb-6 opacity-95">
                Know what your kitchen renovation will cost before talking to contractors. Get an instant AI estimate based on real Toronto market data.
              </p>
              <Link
                href="/"
                className="inline-block bg-white text-orange-600 font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                🚀 Get Free Kitchen Estimate
              </Link>
            </section>
          </article>
        </div>
      </div>
    </>
  );
}
