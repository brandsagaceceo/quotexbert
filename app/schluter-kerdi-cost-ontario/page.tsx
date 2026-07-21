import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, DollarSign, CheckCircle, Layers, Shield, Wrench, Thermometer } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Schluter KERDI Cost Ontario 2026 | KERDI-BOARD, DITRA & Full System Pricing',
  description:
    'Complete 2026 pricing guide for Schluter KERDI, KERDI-BOARD, and DITRA in Ontario. Material costs, labor rates, full shower system prices, and comparison to traditional methods.',
  keywords: [
    'Schluter KERDI cost Ontario',
    'KERDI board price Ontario',
    'Schluter shower system cost Canada',
    'how much does Schluter KERDI cost',
    'DITRA heat installation cost Ontario',
    'Schluter KERDI-BOARD price',
    'tile waterproofing cost Ontario',
    'Schluter shower kit cost 2026',
    'KERDI membrane cost per square foot',
    'Schluter vs cement board cost',
  ],
  openGraph: {
    title: 'Schluter KERDI Cost Ontario 2026 | Full System Pricing',
    description: 'KERDI, KERDI-BOARD, DITRA-HEAT — exact material costs, labor rates, and complete system prices for Ontario bathrooms.',
    url: 'https://www.quotexbert.com/schluter-kerdi-cost-ontario',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Schluter KERDI Cost Ontario 2026 | QuoteXbert',
    description: 'Real 2026 Schluter pricing for Ontario bathrooms. Material + labor + full system costs.',
  },
  alternates: { canonical: 'https://www.quotexbert.com/schluter-kerdi-cost-ontario' },
};

const materialPricing = [
  {
    product: 'Schluter-KERDI Waterproofing Membrane',
    sku: 'KERDI-10 (10 sq ft roll)',
    supplyPrice: '$28 – $35',
    coverageNote: '10 sq ft per roll. A standard 3×5 shower requires 4–6 rolls for walls.',
    perSqFt: '$2.80 – $3.50/sq ft',
    whereAvailable: 'Home Depot, Lowes, tile specialty stores',
  },
  {
    product: 'Schluter-KERDI-BOARD (Panel)',
    sku: '½" × 4×8 ft panel',
    supplyPrice: '$80 – $110 per panel',
    coverageNote: '32 sq ft per panel. A standard shower enclosure needs 4–6 panels.',
    perSqFt: '$2.50 – $3.44/sq ft',
    whereAvailable: 'Home Depot, tile specialty stores, Schluter distributor',
  },
  {
    product: 'Schluter-KERDI-SHOWER Tray (Kit)',
    sku: '36×60 inch prefab tray',
    supplyPrice: '$320 – $490',
    coverageNote: 'Pre-sloped foam shower base. Eliminates need for mortar bed.',
    perSqFt: 'N/A — fixed size',
    whereAvailable: 'Tile specialty stores, Schluter distributor',
  },
  {
    product: 'Schluter-KERDI-DRAIN',
    sku: 'Standard 4" bonding flange drain',
    supplyPrice: '$80 – $130',
    coverageNote: 'Single unit per shower. Pairs with KERDI membrane.',
    perSqFt: 'N/A — unit pricing',
    whereAvailable: 'Schluter distributor, specialty tile stores',
  },
  {
    product: 'Schluter-KERDI-BAND Waterproofing Strip',
    sku: '5-inch × 16 ft roll',
    supplyPrice: '$22 – $30',
    coverageNote: 'Seals joints and transitions. Typically 2–3 rolls per shower.',
    perSqFt: 'N/A — linear pricing',
    whereAvailable: 'Home Depot, Schluter distributor',
  },
  {
    product: 'Schluter-DITRA Uncoupling Membrane',
    sku: 'DITRA by the roll (approx. 54 sq ft)',
    supplyPrice: '$90 – $120 per roll',
    coverageNote: 'Floor tile installation. Prevents cracking on wood subfloors.',
    perSqFt: '$1.67 – $2.22/sq ft',
    whereAvailable: 'Home Depot, Lowes, tile stores',
  },
  {
    product: 'Schluter-DITRA-HEAT Electric Mat',
    sku: '10 sq ft starter kit (mat + thermostat)',
    supplyPrice: '$180 – $280 (kit); $8 – $12/sq ft mat only',
    coverageNote: 'Full bathroom floor: $350–$700 for materials (mat only, add thermostat).',
    perSqFt: '$8 – $12/sq ft (mat only)',
    whereAvailable: 'Home Depot, Schluter distributor',
  },
];

const fullSystemCosts = [
  {
    system: 'Basic KERDI Shower Waterproofing',
    desc: 'KERDI membrane over cement board walls + DITRA floor + KERDI-DRAIN',
    materials: '$600 – $900',
    labor: '$800 – $1,400',
    total: '$1,400 – $2,300',
    bestFor: 'Budget-conscious shower renovation, existing cement board in place',
  },
  {
    system: 'Full KERDI-BOARD Shower System',
    desc: 'KERDI-BOARD panels (replacing drywall/cement board) + KERDI membrane + DITRA floor + drain',
    materials: '$900 – $1,500',
    labor: '$1,200 – $2,000',
    total: '$2,100 – $3,500',
    bestFor: 'New shower builds, best-in-class waterproofing, fastest installation',
  },
  {
    system: 'KERDI-BOARD + Prefab Shower Tray',
    desc: 'Full KERDI-BOARD walls + prefab foam tray (no mortar bed) + KERDI-DRAIN',
    materials: '$1,200 – $1,800',
    labor: '$1,400 – $2,200',
    total: '$2,600 – $4,000',
    bestFor: 'Fastest installation, perfect slope guaranteed, ideal for new tub-to-shower conversions',
  },
  {
    system: 'DITRA-HEAT Bathroom Floor',
    desc: 'DITRA-HEAT mat + thermostat + standard tile installation',
    materials: '$450 – $900',
    labor: '$600 – $1,200',
    total: '$1,050 – $2,100',
    bestFor: 'Heated floor in any Ontario bathroom — most popular upgrade in Durham Region and GTA',
  },
  {
    system: 'Complete Bathroom System (shower + floor)',
    desc: 'Full KERDI-BOARD shower + DITRA-HEAT floor + KERDI-DRAIN + all membranes',
    materials: '$1,800 – $3,000',
    labor: '$2,200 – $3,800',
    total: '$4,000 – $6,800',
    bestFor: 'Full bathroom gut renovation — the most comprehensive waterproofing and heating system available',
  },
];

const vsTraditional = [
  {
    aspect: 'Material cost',
    schluter: '$900 – $1,500 for a shower system',
    traditional: '$250 – $450 (cement board + RedGard liquid membrane)',
    winner: 'traditional',
    note: 'Schluter is 3× more expensive in raw materials',
  },
  {
    aspect: 'Labor time (prep before tile)',
    schluter: '1–2 days (KERDI-BOARD installs fast; no wet trades)',
    traditional: '3–5 days (cement board + liquid membrane + dry time)',
    winner: 'schluter',
    note: 'Schluter saves 1–3 days of labor — partly offsetting material cost',
  },
  {
    aspect: 'Waterproofing reliability',
    schluter: '100% — factory-engineered system with lifetime warranty',
    traditional: '70–85% — depends on application quality, overlap, and dry cure',
    winner: 'schluter',
    note: 'KERDI is physically impermeable; liquid membranes can fail at joints or pinholes',
  },
  {
    aspect: 'Long-term mold risk',
    schluter: 'Very low — zero water infiltration when correctly installed',
    traditional: 'Higher — minor application errors allow moisture into the wall cavity over years',
    winner: 'schluter',
    note: 'The most common reason to gut a bathroom in Ontario is mold from failed traditional waterproofing',
  },
  {
    aspect: 'Total installed cost difference',
    schluter: '$3,500 – $6,000 (fully waterproofed, pre-tile)',
    traditional: '$3,000 – $5,500 (fully waterproofed, pre-tile)',
    winner: 'draw',
    note: 'Material cost difference largely offset by faster Schluter labor — total is within $500–$1,000',
  },
];

const faqs = [
  {
    q: 'How much does Schluter KERDI cost in Ontario?',
    a: 'Schluter KERDI membrane (the waterproofing sheet) costs $28–$35 per 10 sq ft roll at Home Depot in Ontario (July 2026). A standard 3×5 ft shower enclosure requires $110–$200 in KERDI membrane for the walls. If you are building a full shower with KERDI-BOARD panels, expect $900–$1,500 in Schluter materials total before tile.',
  },
  {
    q: 'How much does it cost to install a complete Schluter shower system in Ontario?',
    a: 'A complete Schluter shower installation in Ontario (KERDI-BOARD walls, prefab tray, KERDI-DRAIN, all membranes — not including tile) costs $2,600–$4,000 for materials and labor. A full bathroom gut renovation with Schluter waterproofing throughout plus DITRA-HEAT heated floor runs $4,000–$6,800 before tile, vanity, and fixtures.',
  },
  {
    q: 'Is Schluter more expensive than cement board and RedGard?',
    a: 'Schluter materials cost approximately 3× more than cement board + liquid membrane. However, Schluter installation is significantly faster — saving 1–3 days of labor. The total installed cost difference is typically $500–$1,000 in favour of traditional methods, but Schluter provides far superior waterproofing with a lifetime warranty.',
  },
  {
    q: 'How much does DITRA-HEAT cost to install in Ontario?',
    a: 'DITRA-HEAT electric mat costs $8–$12 per sq ft for materials. For a standard 5×8 ft bathroom floor (40 sq ft), materials cost $320–$480 for the mat alone, plus a thermostat ($80–$180). Professional installation (mat embedding, electrical connection by licensed electrician) adds $600–$1,200. Total DITRA-HEAT installed cost for a standard bathroom: $1,050–$1,800.',
  },
  {
    q: 'Where can I buy Schluter products in Ontario?',
    a: 'Schluter products are widely available at Home Depot (most locations), Lowes, and specialty tile stores. The Schluter-KERDI membrane and DITRA mat are typically stocked at Home Depot. Schluter-KERDI-BOARD panels and shower trays are more commonly found at tile specialty stores and Schluter authorized distributors. Schluter has a Canadian training centre in Mississauga, ON.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Schluter KERDI Cost Ontario 2026',
  url: 'https://www.quotexbert.com/schluter-kerdi-cost-ontario',
  publisher: { '@type': 'Organization', name: 'QuoteXbert', url: 'https://www.quotexbert.com' },
  mainEntity: {
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
};

export default function SchluterKerdiCostPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-[#1e1b21] to-[#2d0008] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(128,0,32,0.15),transparent_50%)]" />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-300 mb-8">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <Link href="/guides" className="hover:text-amber-400 transition-colors">Guides</Link>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <Link href="/who-installs-schluter-shower-systems-near-me" className="hover:text-amber-400 transition-colors">Schluter Installer Guide</Link>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-100">KERDI Cost</span>
          </nav>
          <span className="inline-block bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            Schluter Pricing Guide · Ontario 2026
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight text-white mb-6">
            Schluter KERDI Cost<br className="hidden md:block" /> Ontario 2026
          </h1>
          <p className="text-xl text-slate-200 leading-relaxed max-w-3xl mb-8">
            Exact material prices for KERDI, KERDI-BOARD, and DITRA-HEAT in Ontario. Full system installation costs, labor rates, and an honest comparison to traditional waterproofing methods.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/create-lead" className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-[#990024] transition-all text-lg">
              <DollarSign className="w-5 h-5" /> Get My Free Bathroom Estimate <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/who-installs-schluter-shower-systems-near-me" className="inline-flex items-center gap-2 bg-slate-800 text-white font-semibold px-6 py-4 rounded-xl border border-slate-700 hover:bg-slate-700 transition-all">
              Find a Schluter Installer
            </Link>
          </div>
        </div>
      </section>

      {/* Material Pricing */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Schluter Product Prices in Ontario</h2>
          <p className="text-slate-600 mb-8 text-lg">Retail supply prices at Ontario home improvement stores. July 2026.</p>
          <div className="space-y-4">
            {materialPricing.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-4 bg-slate-50 border-b border-slate-100">
                  <span className="font-bold text-slate-900">{item.product}</span>
                  <div className="flex gap-3 items-center">
                    <span className="text-xs text-slate-500">{item.sku}</span>
                    <span className="text-lg font-black text-[#800020]">{item.supplyPrice}</span>
                  </div>
                </div>
                <div className="px-6 py-4 flex flex-wrap gap-4 text-sm text-slate-600">
                  <div><strong>Coverage/Unit:</strong> {item.coverageNote}</div>
                  <div><strong>Per sq ft:</strong> {item.perSqFt}</div>
                  <div><strong>Available at:</strong> {item.whereAvailable}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full System Costs */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Complete Schluter System Installation Costs</h2>
          <p className="text-slate-600 mb-8 text-lg">Total cost including materials and professional installation labor. Tile not included.</p>
          <div className="space-y-5">
            {fullSystemCosts.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-black text-slate-900 text-lg">{s.system}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{s.desc}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-[#800020]">{s.total}</div>
                    <div className="text-xs text-slate-400">Total installed</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-slate-50 rounded-lg p-3 text-sm">
                    <div className="text-xs text-slate-400 mb-0.5">Materials only</div>
                    <div className="font-bold text-slate-800">{s.materials}</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 text-sm">
                    <div className="text-xs text-slate-400 mb-0.5">Labor only</div>
                    <div className="font-bold text-slate-800">{s.labor}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span><strong>Best for:</strong> {s.bestFor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* vs Traditional */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Schluter vs. Traditional Waterproofing: Cost Comparison</h2>
          <p className="text-slate-600 mb-8 text-lg">Honest side-by-side cost and performance comparison for Ontario shower builds.</p>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="text-left p-4">Aspect</th>
                  <th className="text-left p-4">Schluter System</th>
                  <th className="text-left p-4">Traditional (Cement Board + Liquid)</th>
                  <th className="text-center p-4">Winner</th>
                </tr>
              </thead>
              <tbody>
                {vsTraditional.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="p-4 font-medium">{row.aspect}</td>
                    <td className="p-4 text-slate-700">{row.schluter}</td>
                    <td className="p-4 text-slate-700">{row.traditional}</td>
                    <td className="p-4 text-center">
                      <span className={`text-xs font-black px-2 py-1 rounded-full ${row.winner === 'schluter' ? 'bg-blue-100 text-blue-800' : row.winner === 'traditional' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
                        {row.winner === 'schluter' ? 'Schluter' : row.winner === 'traditional' ? 'Traditional' : 'Draw'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
            <strong>Bottom line:</strong> Schluter costs roughly $500–$1,000 more installed than traditional methods. The premium buys you a physically impermeable system with a lifetime warranty — eliminating the single largest cause of premature bathroom gut renovations in Ontario.
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#800020] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Thermometer className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-3xl font-black mb-4">Get a Quote from a Schluter-Trained Contractor</h2>
          <p className="text-lg text-rose-100 mb-8">
            QuoteXbert connects Ontario homeowners with bathroom contractors experienced in Schluter system installation. Describe your project and get matched instantly.
          </p>
          <Link href="/create-lead" className="inline-flex items-center gap-2 bg-white text-[#800020] font-black px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all text-lg">
            Find a Schluter-Trained Contractor <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="py-14 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-black text-slate-900 mb-8">Complete Schluter Guide Series</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link href="/who-installs-schluter-shower-systems-near-me" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#800020] hover:shadow-md transition-all group">
              <Wrench className="w-8 h-8 text-[#800020] mb-3" />
              <h3 className="font-bold text-slate-900 group-hover:text-[#800020] mb-1">Who Installs Schluter Near Me?</h3>
              <p className="text-sm text-slate-500">Find certified Schluter installers in Ontario</p>
            </Link>
            <Link href="/can-i-renovate-my-bathroom-for-10000-ontario" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#800020] hover:shadow-md transition-all group">
              <Layers className="w-8 h-8 text-amber-500 mb-3" />
              <h3 className="font-bold text-slate-900 group-hover:text-[#800020] mb-1">$10,000 Bathroom Budget Guide</h3>
              <p className="text-sm text-slate-500">Does Schluter fit in a $10k bathroom budget?</p>
            </Link>
            <Link href="/bathroom-renovation-calculator" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#800020] hover:shadow-md transition-all group">
              <Shield className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-900 group-hover:text-[#800020] mb-1">Bathroom Renovation Calculator</h3>
              <p className="text-sm text-slate-500">Instant AI estimate for your Ontario bathroom</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
