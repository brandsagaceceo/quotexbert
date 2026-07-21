import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Shield, Wrench, DollarSign, Award, AlertTriangle, Layers, HelpCircle, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Who Installs Schluter Shower Systems Near Me? | Ontario Cost & Guide',
  description:
    'Find certified Schluter shower installers in Ontario. In-depth 2026 guide on Schluter waterproofing costs, installing over plywood, Kerdi/Ditra systems, and hiring trusted local contractors.',
  keywords: [
    'who installs Schluter shower systems near me',
    'Schluter shower installation Ontario',
    'Schluter waterproofing cost',
    'can I use Schluter over plywood',
    'Kerdi board shower installer Toronto',
    'Schluter certified tile contractor GTA',
    'Ditra heat installer near me',
  ],
  openGraph: {
    title: 'Who Installs Schluter Shower Systems Near Me? | Ontario Cost & Guide',
    description: 'Find verified Schluter shower installers in Ontario. Learn about Schluter waterproofing costs, plywood substrate rules, and get local contractor quotes.',
    url: 'https://www.quotexbert.com/who-installs-schluter-shower-systems-near-me',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Who Installs Schluter Shower Systems Near Me? | QuoteXbert',
    description: 'Schluter shower systems installer guide for Ontario. Costs, plywood guidelines, and verified contractors.',
  },
  alternates: {
    canonical: 'https://www.quotexbert.com/who-installs-schluter-shower-systems-near-me',
  },
};

const components = [
  {
    name: 'Schluter-KERDI',
    icon: 'Layers',
    role: 'Waterproofing Membrane',
    desc: 'A pliable sheet-applied polyethylene waterproofing membrane and vapor-retarder. It is bonded to the shower walls using thin-set mortar to prevent water and vapor infiltration.',
  },
  {
    name: 'Schluter-KERDI-BOARD',
    icon: 'Shield',
    role: 'Waterproof Building Panel',
    desc: 'An extruded polystyrene foam panel covered on both sides with a reinforcement material and a fleece webbing. It replaces cement board or drywall, providing a flat, level, and 100% waterproof tiling surface.',
  },
  {
    name: 'Schluter-KERDI-SHOWER-T',
    icon: 'Wrench',
    role: 'Pre-Sloped Shower Tray',
    desc: 'Lightweight, prefabricated foam shower trays that eliminate the need for a traditional mortar bed. They are pre-sloped directly toward the drain, ensuring perfect water drainage every time.',
  },
  {
    name: 'Schluter-KERDI-BAND',
    icon: 'Layers',
    role: 'Waterproof Joint Strip',
    desc: 'A specialized waterproofing band used to seal butt joints, corners, and connections between components (like KERDI-BOARD panels or floor-to-wall transitions) to create an unbroken waterproof seal.',
  },
  {
    name: 'Schluter-KERDI-DRAIN',
    icon: 'Wrench',
    role: 'Integrated Bonding Flange Drain',
    desc: 'Features a large integrated bonding flange that provides a secure, water-tight connection to the KERDI waterproofing membrane at the top of the assembly, preventing leaks around the drain pipe.',
  },
  {
    name: 'Schluter-DITRA / DITRA-HEAT',
    icon: 'Award',
    role: 'Uncoupling & Floor Heating',
    desc: 'DITRA is an uncoupling membrane that prevents tile grout lines from cracking due to movement in the wood substrate. DITRA-HEAT integrates customizable electric cable heating directly into the same mat.',
  },
];

const pricingComparison = [
  {
    element: 'Waterproofing System',
    schluter: 'Schluter-KERDI & KERDI-BOARD ($900 – $1,500 for a standard shower kit)',
    traditional: 'Cement Board + Liquid Membrane (e.g., RedGard) ($250 – $450 total)',
    verdict: 'Schluter costs 3x more in raw material but is 100% waterproof and lifetime-warranted.',
  },
  {
    element: 'Base Preparation',
    schluter: 'Pre-Sloped Foam Tray ($250 – $400) — takes 30 minutes to install',
    traditional: 'Dry-Pack Mortar Bed (sand/cement mix) ($50 – $100) — takes 24h to dry',
    verdict: 'Foam trays save high-cost site labor hours and guarantee a perfect slope.',
  },
  {
    element: 'Professional Labor',
    schluter: '$1,800 – $3,500 (Faster installation, typically 1.5 – 3 days prep before tile)',
    traditional: '$2,200 – $4,500 (Slower multi-stage dry times, takes 3 – 5 days prep)',
    verdict: 'Schluter labor is highly efficient. The reduction in work hours offsets material costs.',
  },
  {
    element: 'Average Total Price',
    schluter: '<strong>$3,500 – $6,000</strong> (Fully prepped, waterproofed, and tiled)',
    traditional: '<strong>$3,000 – $5,500</strong> (Fully prepped, painted waterproofing, and tiled)',
    verdict: 'For an extra $500, Schluter buys absolute peace of mind and structural durability.',
  },
];

const plywoodSubstrateRules = [
  {
    rule: 'Never Apply KERDI Membrane Directly Over Plywood in a Shower',
    type: 'critical',
    desc: 'Plywood is a highly unstable material that expands and contracts drastically when subjected to humidity and temperature changes. Applying KERDI membrane directly to a raw plywood shower wall is a violation of both Schluter warranty terms and the Terrazzo Tile & Marble Association of Canada (TTMAC) guidelines. For shower walls, plywood must be covered with KERDI-BOARD or cement board first.',
  },
  {
    rule: 'DITRA Layer is Mandatory on Plywood Subfloors',
    type: 'mandatory',
    desc: 'For bathroom floors, you can install tile over plywood, but you must use Schluter-DITRA or DITRA-HEAT as an uncoupling layer. The adhesive wood-to-tile bond will crack without it. Secure the DITRA to the plywood subfloor using a modified thin-set mortar (meeting ANSI A118.11 standards) or Schluter ALL-SET.',
  },
  {
    rule: 'Verify Underlayment Thickness and Framing Spacing',
    type: 'technical',
    desc: 'To install DITRA over plywood, your subfloor must be a minimum of 5/8" (16 mm) thick tongue-and-groove plywood or OSB, with joist spacing no greater than 19.2" (488 mm) on center. For premium stone tile, standard practice in Ontario is a double-layer plywood floor (minimum 1-1/8" total thickness) to eliminate structural deflection.',
  },
  {
    rule: 'Use the Right Thin-Set Mortar',
    type: 'technical',
    desc: 'When bonding Schluter products to plywood, use a modified thin-set mortar (like Schluter ALL-SET or FAST-SET) to bond the fleece backing of the Schluter membrane to the wood. Modified thinset contains polymers that adhere securely to plywood.',
  },
];

const faqs = [
  {
    q: 'How do I know if a contractor is truly qualified to install Schluter systems?',
    a: "A qualified contractor should ideally have attended Schluter's official Innovation Workshops (held frequently at their Canadian training base in Mississauga, ON). Ask specifically: 'Have you attended the Schluter Innovation Workshop?' and check if they can explain standard Schluter protocols, such as doing a 24-hour water test (flood test) and using unmodified thin-set over the KERDI membrane.",
  },
  {
    q: 'How much does it cost to waterproof a shower using Schluter?',
    a: "In Ontario, the materials for a standard 3-sided Schluter KERDI shower kit (including tray, curb, membrane, band, and drain) cost between $900 and $1,400. Professional labor to install the waterproofing system averages $1,000 to $1,800, bringing the total waterproofing & prep cost to $1,900 to $3,200 before purchasing or setting tiles.",
  },
  {
    q: 'Can you install Schluter Kerdi-Board over drywall?',
    a: "Yes, Schluter-KERDI-BOARD can be installed directly over existing drywall using thin-set mortar or wood screws with specialized Schluter-KERDI-BOARD-ZT washers. However, in wet areas like a shower enclosure, we highly recommend removing old drywall and fastening the moisture-insulating KERDI-BOARD directly to the open wood or steel studs for the ultimate structural integrity.",
  },
  {
    q: 'Why does Schluter require unmodified thin-set mortar over Kerdi?',
    a: "Schluter waterproofing membranes are completely impervious to water and vapor. Modified thin-set mortars require access to air/oxygen to dry and cure properly. Because water cannot evaporate through the Schluter membrane or glaze tiles, modified thin-set between them would take weeks to cure. Unmodified thin-set (meeting ANSI A118.1 standards) or specialized Schluter ALL-SET cures chemically without needing to dry out, ensuring a permanent bond.",
  },
  {
    q: 'Does QuoteXbert match me with Schluter-certified bathroom contractors?',
    a: "Absolutely. When you submit your project details through our primary system, our matching algorithms prioritize bathroom contractors who have extensive tile experience and are trained in Schluter waterproofing standards. You can specify 'Schluter system' in your project description to instantly alert qualified installers.",
  },
];

export default function SchluterInstallerGuide() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-[#1e1b21] to-[#2d0008] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(128,0,32,0.15),transparent_50%)]" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-300 mb-8">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <Link href="/guides" className="hover:text-amber-400 transition-colors">Guides</Link>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-100 font-medium">Schluter Shower Installers near me</span>
          </nav>

          <div className="max-w-4xl space-y-6">
            <span className="inline-block bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
              Tile Waterproofing Authority Guide
            </span>
            <h1 className="text-4xl md:text-6xl font-black leading-tight text-white">
              Who Installs Schluter Shower Systems Near Me?
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 font-normal leading-relaxed">
              Find qualified schluter shower system installers across Ontario. Learn real 2026 pricing, installation guidelines over plywood substrates, and why water testing is mandatory.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/create-lead"
                className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-[#990024] hover:shadow-2xl transition-all text-lg"
              >
                🛠️ Find a Certified Schluter Installer <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/bathroom-renovation-calculator"
                className="inline-flex items-center gap-2 bg-slate-800 text-white font-semibold px-6 py-4 rounded-xl border border-slate-700 hover:bg-slate-700 transition-all text-base"
              >
                Calculate Bathroom Cost
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-slate-300 pt-2 font-medium">
              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Verified Certifications</div>
              <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-400" /> Standard Schluter Warranty</div>
              <div className="flex items-center gap-2"><Award className="w-4 h-4 text-emerald-400" /> Real TTMAC Tile Compliance</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Elements / Anchor Intro */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="p-8 bg-[#fff9f6] border-l-4 border-amber-500 rounded-r-xl shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Before You Hire a Bathroom Contractor in Ontario:</h2>
            <p className="text-slate-700 leading-relaxed text-base">
              A shower renovation looks beautiful on the outside, but its actual lifespan is determined by what is <strong>underneath the tile</strong>. In Southern Ontario, traditional shower pan preparation (using drywall, cement board with taped seams, or simple painted liquid waterproofing) is statistically the leading cause of premature bathroom renovation failure, costing homeowners thousands in structural subfloor mold damage.
            </p>
            <p className="text-slate-700 leading-relaxed text-base">
              To defend against this, the <strong>Schluter Shower System</strong> has emerged as the industry's ultimate gold standard. Because it integrates pre-sloped trays, waterproof panels, and waterproof bonding flanges into a sealed orange envelope, water is completely contained on top of the membrane, drying cleanly down the drain. Below is an exhaustive technical look at costs, installation standards, substrate requirements, and how to verify high-caliber installers.
            </p>
          </div>
        </div>
      </section>

      {/* System Breakdown */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Decoding the Schluter Shower System: Core Components</h2>
            <p className="text-slate-600">
              Schluter is a comprehensive ecosystem of engineered components. A certified installer knows how to lay out each piece to create an airtight seal.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {components.map((c) => (
              <div key={c.name} className="p-6 bg-slate-50 border border-slate-200 rounded-xl relative hover:shadow-md transition-shadow">
                <span className="text-xs font-bold text-amber-600 tracking-wide uppercase block mb-1">{c.role}</span>
                <h3 className="text-lg font-black text-slate-900 mb-2">{c.name}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plywood Guide */}
      <section className="py-16 bg-slate-900 text-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(128,0,32,0.1),transparent_40%)]" />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="flex items-center gap-3 mb-6 text-amber-400">
            <AlertTriangle className="w-8 h-8" />
            <h2 className="text-3xl font-black">Can I Use Schluter Waterproofing Over Plywood?</h2>
          </div>
          <p className="text-slate-300 text-lg leading-relaxed mb-10 max-w-4xl">
            This is one of the most common questions Ontario homeowners and DIYer tilers ask. In Canada, many residential homes are constructed on framed wooden studs with plywood subflooring. Because wood behaves much differently than masonry substrates, there are strict rules to prevent structural failure:
          </p>

          <div className="space-y-6">
            {plywoodSubstrateRules.map((rule, idx) => (
              <div key={idx} className="p-6 bg-slate-800/80 border border-slate-700 rounded-xl flex items-start gap-4">
                <span className="flex-shrink-0 bg-amber-500 text-slate-950 font-black text-sm w-8 h-8 rounded-full flex items-center justify-center">
                  {idx + 1}
                </span>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {rule.rule}
                    {rule.type === 'critical' && (
                      <span className="text-[10px] bg-red-600 text-white uppercase px-2 py-0.5 rounded font-black tracking-wide">
                        Severe Risk
                      </span>
                    )}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{rule.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 bg-slate-800 border border-slate-700 rounded-xl max-w-3xl">
            <h4 className="font-bold text-amber-400 mb-2">Tile Setting Professional Tip:</h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              Before a tile contractor lays DITRA over your plywood subfloor, they should verify structural floor deflection. If the subfloor bounces when stepped on, the ceramic grout lines will eventually crumble. To fix this, high-end contractors will screw an extra layer of 1/2" exterior-grade plywood beneath the DITRA, offsetting seams from the primary 5/8" subfloor layer.
            </p>
          </div>
        </div>
      </section>

      {/* Professional Cost Breakdown */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">How Much Does Schluter Waterproofing Cost in Ontario?</h2>
            <p className="text-slate-600 text-base">
              A detailed breakdown of materials, professional tile prep hours, and structural comparisons for a typical 3&apos; x 5&apos; walk-in tile shower in the GTA.
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 bg-slate-100 p-4 border-b border-slate-200 text-xs md:text-sm font-bold text-slate-700">
              <div>Project Element</div>
              <div>Schluter Kerdi Solution</div>
              <div>Traditional Waterproofing</div>
              <div>The Verdict</div>
            </div>
            {pricingComparison.map((row, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-1 md:grid-cols-4 p-4 border-b border-slate-200 text-sm items-center gap-4 ${
                  idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'
                }`}
              >
                <div className="font-bold text-slate-900">{row.element}</div>
                <div className="text-slate-700 text-xs md:text-sm" dangerouslySetInnerHTML={{ __html: row.schluter }} />
                <div className="text-slate-700 text-xs md:text-sm" dangerouslySetInnerHTML={{ __html: row.traditional }} />
                <div className="text-amber-800 text-xs md:text-sm bg-amber-50 p-2 rounded border border-amber-100 font-medium">
                  {row.verdict}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center bg-slate-50 rounded-xl p-6 border border-slate-200 max-w-2xl mx-auto">
            <p className="text-sm text-slate-600 leading-relaxed">
              Want to see exactly how these costs apply to your bathroom layout? Estimate your full refresh budget in minutes using our interactive [app/bathroom-renovation-calculator/page.tsx](app/bathroom-renovation-calculator/page.tsx).
            </p>
          </div>
        </div>
      </section>

      {/* Deep Technical Guide / Installer Verification Checklist */}
      <section className="py-16 bg-[#faf6f7] border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900">
              The 24-Hour Flood Test: Waterproof Verification Checklist
            </h2>
            <p className="text-slate-700 leading-relaxed text-base">
              The true test of raw waterproofing skill comes before tile or thin-set adhesive is touched. High-integrity tile setters always perform a <strong>24-hour flood test</strong> on a newly finished Schluter base.
            </p>
            <p className="text-slate-700 leading-relaxed text-base">
              To do this, the drain is plugged using a pneumatic expansion plug, and the shower tray is filled with water up to adjacent threshold curb heights. A pencil mark records the water level. After 24 full hours:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <li className="flex items-center gap-2 text-sm text-slate-800 font-medium"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Zero drop in water (excluding ~1mm of natural evaporation).</li>
              <li className="flex items-center gap-2 text-sm text-slate-800 font-medium"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Subfloor below the tray remains 100% dry.</li>
              <li className="flex items-center gap-2 text-sm text-slate-800 font-medium"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Adjacent drywall framing exhibits zero dampness.</li>
              <li className="flex items-center gap-2 text-sm text-slate-800 font-medium"><CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Schluter lifetime warranty is secured.</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Wrench className="w-6 h-6 text-[#800020]" />
              How to Interview a Local Ontarian Contractor
            </h3>
            <p className="text-slate-600 text-sm">
              Do not take a contractor&apos;s word on faith. Ask these exact qualifying questions on-site:
            </p>

            <div className="space-y-4 text-sm">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="font-bold text-slate-900 mb-1">Q1: &quot;What thin-set mortar will you be using to set tiles over the KERDI waterproofing membrane?&quot;</p>
                <p className="text-slate-600"><strong className="text-[#800020]">Correct Answer:</strong> Unmodified thin-set (meeting ANSI A118.1), or specialized Schluter ALL-SET or FAST-SET. If they insist on standard modified thin-set over Kerdi, they are not aware of curing mechanics and may cause structural failure.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="font-bold text-slate-900 mb-1">Q2: &quot;Do you perform a 24-hour flood test before starting tile setting?&quot;</p>
                <p className="text-slate-600"><strong className="text-[#800020]">Correct Answer:</strong> Yes, absolutely. It is a fundamental procedure to verify seams before tiling. Any installer claiming &apos;Schluter is waterproof, we don&apos;t flood test&apos; is taking shortcuts that violate TTMAC rules.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="font-bold text-slate-900 mb-1">Q3: &quot;Do you have the 10-Year Schluter System warranty sheet?&quot;</p>
                <p className="text-slate-600"><strong className="text-[#800020]">Correct Answer:</strong> Yes, professional installers who have been trained in Mississauga workshop hubs can provide standard Schluter system warranty packages to homeowners, specifying component integration.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-8 text-center flex items-center justify-center gap-3">
            <HelpCircle className="w-8 h-8 text-[#800020]" /> Schluter Shower System FAQ
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-3 text-lg">{faq.q}</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internal City Redirection Hub */}
      <section className="py-12 bg-slate-100 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-lg font-black text-slate-900 mb-5">Localized Ontario Renovation Guides</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Whitby Bathroom Guide', href: '/bathroom-renovation-whitby' },
              { label: 'Toronto Bathroom Costs', href: '/bathroom-renovation-cost-toronto' },
              { label: 'Oshawa Bathroom Remodels', href: '/bathroom-renovation-oshawa' },
              { label: 'Ajax Bathroom Projects', href: '/bathroom-renovation-ajax' },
              { label: 'Pickering Bathroom Renos', href: '/bathroom-renovation-pickering' },
              { label: 'Courtice Bathroom Service', href: '/bathroom-renovation-courtice' },
              { label: 'QuoteXbert Learning Center', href: '/guides' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="bg-white hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2 rounded-lg border border-slate-200 text-xs shadow-sm hover:shadow-md transition-all"
              >
                {link.label} &rarr;
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final Action Hero */}
      <section className="py-20 bg-gradient-to-br from-[#800020] to-[#5c0015] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[#000]/10" />
        <div className="max-w-3xl mx-auto px-4 relative z-10 space-y-6">
          <h2 className="text-3xl md:text-5xl font-black">Hire a Trained Schluter Installer Today</h2>
          <p className="text-rose-100 text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Ready to secure a wet-room bathroom layout that will remain leak-free forever? Use our AI estimate tool to calculate layout costs and find certified local crews.
          </p>
          <div className="pt-4">
            <Link
              href="/create-lead"
              className="bg-white hover:bg-rose-50 text-[#800020] font-black text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all inline-block"
            >
              Get Free Instant Estimate &rarr;
            </Link>
            <p className="text-xs text-rose-200 mt-3 font-medium">Free Estimate · No Card Needed · Verified Contractors Only</p>
          </div>
        </div>
      </section>
    </main>
  );
}
