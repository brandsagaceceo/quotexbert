import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin, CheckCircle, Clock, DollarSign, FileText, Users, Home, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Complete Durham Region Renovation Guide 2025 | Every City, Every Trade | QuoteXbert',
  description:
    'The definitive guide to home renovation in Durham Region, Ontario. Every city, every trade, permit contacts, cost data, contractor tips, and neighbourhood-level advice for Oshawa, Whitby, Ajax, Pickering, Bowmanville & all Durham cities.',
  keywords: [
    'Durham Region renovation guide',
    'home renovation Durham Region Ontario',
    'Durham Region renovation complete guide',
    'Oshawa Whitby Ajax Pickering renovation',
    'Durham Region contractors',
    'Durham Region renovation costs 2025',
    'Clarington renovation guide',
  ],
  openGraph: {
    title: 'Complete Durham Region Renovation Guide 2025 | QuoteXbert',
    description: 'Everything you need to renovate your Durham Region home — all cities, all trades, permits, costs, and contractors.',
    url: 'https://www.quotexbert.com/durham-region-renovation-guide',
    type: 'article',
  },
  twitter: { card: 'summary_large_image', title: 'Durham Region Renovation Guide 2025 | QuoteXbert', description: 'The complete guide to renovating in Durham Region, Ontario.' },
  alternates: { canonical: 'https://www.quotexbert.com/durham-region-renovation-guide' },
};

const durhamCities = [
  {
    name: 'Oshawa',
    pop: '170,000+',
    desc: "Durham Region's largest city. Mix of 1950s–1990s homes in established neighbourhoods and newer builds in Windfields and Kedron. Largest contractor pool in Durham Region — competitive pricing.",
    commonProjects: ['Kitchen renovations (1970s–1980s galley kitchens)', 'Basement finishing', 'Bathroom updates', 'Window replacement (aging housing stock)'],
    permitContact: 'City of Oshawa Building Services: 905-436-3311',
    costNote: '~15–18% below Toronto core',
    href: '/oshawa',
    tradeLinks: [
      { label: 'Kitchen Renovation', href: '/kitchen-renovation-oshawa' },
      { label: 'Bathroom Renovation', href: '/bathroom-renovation-oshawa' },
      { label: 'Basement Renovation', href: '/basement-renovation-oshawa' },
    ],
  },
  {
    name: 'Whitby',
    pop: '140,000+',
    desc: "One of Durham's fastest-growing cities. Strong mix of 1980s established neighbourhoods and Brooklin's newer developments. Professional commuter families drive renovation demand.",
    commonProjects: ['Basement finishing (Brooklin new builds)', 'Kitchen open-concept conversions', 'Deck construction', 'Master en-suite additions'],
    permitContact: 'Town of Whitby Building Services: 905-430-4300',
    costNote: '~14–16% below Toronto core',
    href: '/whitby',
    tradeLinks: [
      { label: 'Kitchen Renovation', href: '/kitchen-renovation-whitby' },
      { label: 'Bathroom Renovation', href: '/bathroom-renovation-whitby' },
      { label: 'Basement Renovation', href: '/basement-renovation-whitby' },
    ],
  },
  {
    name: 'Ajax',
    pop: '120,000+',
    desc: "Family-friendly city with predominantly 1990s–2000s two-storey homes. Strong renovation activity driven by young families upgrading their homes. Excellent contractor supply.",
    commonProjects: ['Basement finishing (most popular)', 'Kitchen renovations', 'Bathroom updates', 'Open-concept conversions'],
    permitContact: 'Town of Ajax Building Services: 905-619-2529',
    costNote: '~14–16% below Toronto core',
    href: '/ajax',
    tradeLinks: [
      { label: 'Kitchen Renovation', href: '/kitchen-renovation-ajax' },
      { label: 'Bathroom Renovation', href: '/bathroom-renovation-ajax' },
      { label: 'Basement Renovation', href: '/basement-renovation-ajax' },
    ],
  },
  {
    name: 'Pickering',
    pop: '95,000+',
    desc: "Borders Toronto — giving homeowners access to both Durham Region and Toronto contractors. Massive Seaton development creating new renovation demand. Bay Ridges area has older homes needing updates.",
    commonProjects: ['Basement finishing (Seaton new builds)', 'Bay Ridges kitchen/bathroom updates', 'Roof replacements (older stock)', 'Landscaping and decks'],
    permitContact: 'City of Pickering Building Services: 905-420-4617',
    costNote: '~12–15% below Toronto core',
    href: '/pickering',
    tradeLinks: [
      { label: 'Kitchen Renovation', href: '/kitchen-renovation-pickering' },
      { label: 'Bathroom Renovation', href: '/bathroom-renovation-pickering' },
      { label: 'Basement Renovation', href: '/basement-renovation-pickering' },
    ],
  },
  {
    name: 'Bowmanville & Clarington',
    pop: '105,000+',
    desc: "Clarington encompasses Bowmanville, Courtice, and Newcastle. Growing family communities with mix of historic and newer homes. Most affordable renovation market in urban Durham Region.",
    commonProjects: ['Basement finishing', 'Kitchen updates', 'Bathroom renovations', 'Painting and flooring refreshes'],
    permitContact: 'Municipality of Clarington: 905-623-3379',
    costNote: '~17–20% below Toronto core',
    href: '/clarington',
    tradeLinks: [
      { label: 'Kitchen Renovation', href: '/kitchen-renovation-bowmanville' },
      { label: 'Bathroom Renovation', href: '/bathroom-renovation-courtice' },
      { label: 'Painting', href: '/painting-bowmanville' },
    ],
  },
];

const renovationTimeline = [
  {
    phase: 'Planning',
    duration: '2–6 weeks',
    tasks: ['Define project scope and priorities', 'Set realistic budget (add 15–20% contingency)', 'Research typical costs for your city', 'Get an AI benchmark estimate'],
  },
  {
    phase: 'Finding Contractors',
    duration: '1–3 weeks',
    tasks: ['Collect 3+ detailed quotes', 'Verify licences, insurance, and WSIB', 'Check references', 'Review contracts carefully'],
  },
  {
    phase: 'Permits',
    duration: '1–6 weeks',
    tasks: ['Apply for required permits', 'Wait for approval (varies by municipality)', 'Ensure contractor starts after permit approval', 'Keep permit on-site during construction'],
  },
  {
    phase: 'Construction',
    duration: 'Varies by project',
    tasks: ['Regular progress walkthroughs', 'Approve changes in writing', 'Track contractor invoices directly', 'Address issues immediately'],
  },
  {
    phase: 'Completion',
    duration: '1–2 weeks',
    tasks: ['Final walkthrough — create deficiency list', 'Confirm inspections passed', 'Receive warranties and manuals', 'Release final payment after deficiencies resolved'],
  },
];

const budgetGuide = [
  { item: 'Base contractor quote', pct: '60–70%', note: 'Labour + materials as quoted' },
  { item: 'Permits & inspections', pct: '2–5%', note: 'Often excluded from contractor quote' },
  { item: 'Material upgrades', pct: '5–10%', note: 'Actual selections often exceed allowances' },
  { item: 'Site logistics', pct: '1–3%', note: 'Disposal, access, condo fees' },
  { item: 'Contingency', pct: '15–20%', note: 'Hidden issues, change orders, surprises' },
];

const durhamMarketInsights = [
  {
    title: 'Why Durham Region Rates Are Lower',
    content: "Durham Region contractor rates are 12–20% below Toronto core because contractor overhead is lower — insurance, rent, and living costs are all less than central Toronto. The same skill level costs less here. This makes Durham an excellent value for renovation investment.",
  },
  {
    title: 'The Best Time to Renovate in Durham Region',
    content: "Interior renovations (kitchen, bathroom, basement) can be done year-round. Exterior work (decks, roofing, siding, painting) is best May–October. For the best contractor availability and pricing, book interior projects from November–February. Durham contractors are booked 4–6 weeks in advance during peak season (April–September).",
  },
  {
    title: 'Rental Suites in Durham Region',
    content: "Durham Region has one of Ontario's strongest markets for legal basement rental suites outside Toronto. A $50,000–$65,000 suite generates $1,500–$2,000/month in rent. Given Durham's population growth and proximity to Toronto, rental demand is strong and vacancy rates are low across all Durham cities.",
  },
  {
    title: 'New Build Renovations (Seaton, Brooklin)',
    content: "Many Durham Region new builds are sold with unfinished basements, minimal landscaping, and builder-grade finishes. Basement finishing is the #1 renovation project in newer Durham communities. These projects are typically straightforward and cost-efficient — clean slabs, high ceilings, and minimal existing work to remove.",
  },
];

const faqs = [
  {
    q: 'What is the average renovation cost in Durham Region?',
    a: "Durham Region renovation costs are typically 12–20% below Toronto core. Average mid-range renovation costs: kitchen $25,000–$40,000, bathroom $11,000–$18,000, basement finishing $28,000–$45,000, deck $8,000–$18,000. Costs vary within Durham — Pickering (closest to Toronto) is slightly higher than Oshawa or Bowmanville.",
  },
  {
    q: 'How do I find a reliable contractor in Durham Region?',
    a: "Use QuoteXbert to get a free AI estimate first, then connect with verified contractors. To verify a Durham Region contractor independently: confirm their Ontario business licence with the municipality, check WSIB coverage at wsib.ca, verify insurance directly with their insurer, and call references from recent local projects.",
  },
  {
    q: 'How long do building permits take in Durham Region?',
    a: "Standard residential permit processing in Durham Region municipalities takes 5–15 business days for straightforward projects. Secondary suite permits, additions, or projects requiring engineering may take 4–8 weeks. Apply for permits before booking your contractor start date.",
  },
  {
    q: 'Which Durham city has the cheapest renovation costs?',
    a: "Bowmanville and Clarington generally have the lowest renovation costs in urban Durham Region — approximately 17–20% below Toronto. Oshawa and Whitby are 15–18% below Toronto. Pickering, being closest to Toronto and Scarborough, is typically 12–15% below Toronto.",
  },
  {
    q: 'What renovation adds the most value to a Durham Region home?',
    a: "In Durham Region's market: (1) Adding a legal basement suite adds the most absolute value and generates ongoing rental income; (2) Kitchen renovations are most critical for resale — Durham buyers consistently cite kitchens as the #1 purchase factor; (3) Bathroom additions add significant value — many Durham homes have only 1–1.5 bathrooms. See the full ROI guide for all project rankings.",
  },
];

export default function DurhamRegionRenovationGuidePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#800020] text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-rose-200 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/durham-region" className="hover:text-white">Durham Region</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-white">Complete Renovation Guide</span>
          </nav>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm mb-6">
              <FileText className="w-4 h-4" />
              <span>Complete Guide · Updated July 2025 · Durham Region</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              The Complete Durham Region<br />Renovation Guide
            </h1>

            <p className="text-xl text-rose-100 leading-relaxed mb-8 max-w-3xl">
              Everything you need before renovating your Durham Region home. Every city. Every trade.
              Permits, costs, timelines, contractor tips, and neighbourhood-level advice for Oshawa, Whitby, Ajax, Pickering, Clarington, and all Durham communities.
            </p>

            <div className="flex flex-wrap gap-4 text-sm">
              {['All 12 Durham Municipalities', 'Permit Contacts', 'Cost Data', 'ROI Analysis', 'Contractor Guide', 'Free AI Estimates'].map((tag) => (
                <span key={tag} className="bg-white/10 border border-white/20 px-3 py-1 rounded-full">✓ {tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TOC */}
      <section className="py-10 bg-slate-50 border-b">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-base font-bold text-gray-900 mb-3">Jump to Section</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            {[
              { label: 'Durham Region Overview', href: '#overview' },
              { label: 'City-by-City Guide', href: '#cities' },
              { label: 'Renovation Timeline', href: '#timeline' },
              { label: 'Budget Planning', href: '#budget' },
              { label: 'Permits Guide', href: '#permits' },
              { label: 'Finding Contractors', href: '#contractors' },
              { label: 'Market Insights', href: '#insights' },
              { label: 'FAQ', href: '#faq' },
            ].map((item) => (
              <a key={item.href} href={item.href} className="text-rose-600 hover:text-rose-700 hover:underline font-medium">→ {item.label}</a>
            ))}
          </div>
        </div>
      </section>

      {/* Get Estimate CTA */}
      <section className="py-8 bg-rose-50 border-b border-rose-100">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-black text-gray-900">Ready to start? Get your free AI estimate first.</p>
            <p className="text-gray-600 text-sm">Know what&apos;s fair before you call a single Durham contractor.</p>
          </div>
          <Link href="/create-lead" className="bg-[#800020] text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all flex-shrink-0 text-sm">
            📸 Get Free AI Estimate →
          </Link>
        </div>
      </section>

      {/* Overview */}
      <section id="overview" className="py-16 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-black text-gray-900 mb-6">Durham Region: Ontario&apos;s Renovation Sweet Spot</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="prose prose-lg text-gray-700">
              <p>
                Durham Region — comprising the cities of Oshawa, Whitby, Ajax, Pickering, and the municipalities of Clarington, Scugog, Uxbridge, and Brock — is one of Ontario&apos;s most compelling renovation markets. Here&apos;s why:
              </p>
              <p>
                Labour costs in Durham Region are <strong>12–20% below Toronto core</strong>, while material costs are nearly identical. This means homeowners get the same skilled tradespeople at lower rates — simply because contractor overhead is lower in Durham than in Toronto.
              </p>
              <p>
                Durham Region also has some of Ontario&apos;s strongest housing appreciation. A well-executed renovation here not only improves daily life but builds equity in a market that has consistently appreciated over the past decade.
              </p>
              <p>
                The rental market adds another dimension: Durham Region&apos;s proximity to Toronto and strong population growth creates a robust demand for basement rental suites. A legal suite can generate $1,400–$2,000/month — often recouping the renovation cost within 3 years.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { icon: '👥', label: 'Population', value: '730,000+ (growing rapidly)' },
              { icon: '🏘', label: 'Municipalities', value: '8 (plus dozens of communities)' },
              { icon: '💰', label: 'vs Toronto Core', value: '12–20% lower renovation costs' },
              { icon: '🏠', label: 'Housing Stock', value: 'Mix of 1960s–present; strong new build activity' },
              { icon: '📈', label: 'Rental Demand', value: 'Strong — $1,400–$2,000/month for suites' },
              { icon: '👷', label: 'Active Contractors', value: '100+ verified across all trades' },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-50 rounded-xl p-4 flex items-center gap-4">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">{stat.label}</p>
                  <p className="font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* City Guide */}
      <section id="cities" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3">Durham Region City-by-City Renovation Guide</h2>
          <p className="text-gray-600 mb-10">Each Durham city has distinct housing stock, renovation demand, and local market conditions.</p>

          <div className="space-y-8">
            {durhamCities.map((city) => (
              <div key={city.name} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex flex-wrap items-start gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-5 h-5 text-rose-600" />
                      <h3 className="text-xl font-black text-gray-900">
                        <Link href={city.href} className="hover:text-rose-600 transition-colors">{city.name}</Link>
                      </h3>
                      <span className="text-sm text-gray-500">{city.pop}</span>
                    </div>
                    <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">{city.costNote}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">{city.desc}</p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Common Projects</h4>
                    <ul className="space-y-1">
                      {city.commonProjects.map((p) => (
                        <li key={p} className="text-sm text-gray-700 flex items-start gap-1">
                          <span className="text-rose-500 mt-1">•</span> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Trade Guides</h4>
                    <div className="space-y-1">
                      {city.tradeLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="block text-sm text-rose-600 hover:text-rose-700 hover:underline">{link.label} →</Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Permit Contact</h4>
                    <p className="text-xs text-gray-600">{city.permitContact}</p>
                    <Link href={city.href} className="mt-2 inline-block text-sm font-bold text-rose-600 hover:text-rose-700">
                      Full {city.name} Guide →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Rural Durham */}
          <div className="mt-8 bg-amber-50 rounded-2xl p-6 border border-amber-200">
            <h3 className="font-bold text-gray-900 mb-3">Rural Durham Region: Scugog, Uxbridge &amp; Brock</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              The northern and rural parts of Durham Region — Scugog (Port Perry), Uxbridge, and Brock (Cannington, Beaverton, Sunderland) — have distinct renovation markets. Rural properties with well water and septic systems require contractors familiar with rural Ontario building codes. Access considerations can add cost for some projects.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/port-perry" className="text-sm font-medium text-amber-800 bg-amber-100 px-3 py-1 rounded-full hover:bg-amber-200 transition-colors">Port Perry</Link>
              <Link href="/uxbridge" className="text-sm font-medium text-amber-800 bg-amber-100 px-3 py-1 rounded-full hover:bg-amber-200 transition-colors">Uxbridge</Link>
              <Link href="/scugog" className="text-sm font-medium text-amber-800 bg-amber-100 px-3 py-1 rounded-full hover:bg-amber-200 transition-colors">Scugog Township</Link>
              <Link href="/brock" className="text-sm font-medium text-amber-800 bg-amber-100 px-3 py-1 rounded-full hover:bg-amber-200 transition-colors">Brock Township</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section id="timeline" className="py-16 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3">Durham Region Renovation Timeline</h2>
          <p className="text-gray-600 mb-10">From first idea to completed project — what to expect at each phase.</p>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-rose-200 hidden md:block" />
            <div className="space-y-6">
              {renovationTimeline.map((phase, i) => (
                <div key={phase.phase} className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-rose-600 text-white rounded-full flex items-center justify-center font-black text-lg relative z-10">
                    {i + 1}
                  </div>
                  <div className="flex-1 bg-white rounded-xl p-5 border border-gray-200 shadow-sm mb-2">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-black text-gray-900">{phase.phase}</h3>
                      <span className="text-xs bg-rose-100 text-rose-700 font-bold px-2 py-1 rounded-full">{phase.duration}</span>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {phase.tasks.map((task) => (
                        <li key={task} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Budget Planning */}
      <section id="budget" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3">Budget Planning for Durham Region Renovations</h2>
          <p className="text-gray-600 mb-8">The real total cost breakdown — beyond the contractor quote.</p>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
            <h3 className="font-bold text-gray-900 mb-4">Real Budget Breakdown (Example: $35,000 Contractor Quote)</h3>
            <div className="space-y-3">
              {budgetGuide.map((item) => (
                <div key={item.item} className="flex items-center gap-4">
                  <div className="w-48 text-sm font-medium text-gray-700 flex-shrink-0">{item.item}</div>
                  <div className="flex-1 bg-slate-100 rounded-full h-6 relative">
                    <div
                      className="bg-rose-600 h-full rounded-full"
                      style={{ width: item.pct.split('–')[1] || item.pct.split('%')[0] + '%' }}
                    />
                  </div>
                  <div className="w-16 text-sm font-bold text-rose-700 flex-shrink-0">{item.pct}</div>
                  <div className="text-xs text-gray-500 hidden md:block">{item.note}</div>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-3 flex items-center gap-4">
                <div className="w-48 font-black text-gray-900 flex-shrink-0">Realistic Total</div>
                <div className="flex-1" />
                <div className="w-16 font-black text-gray-900">~$48,000</div>
                <div className="text-xs text-gray-600 hidden md:block">vs $35,000 base quote = 37% more</div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
            <h3 className="font-bold text-amber-900 mb-2">⚠️ The Contingency Rule</h3>
            <p className="text-amber-800 text-sm leading-relaxed">
              Always budget 15–20% above the contractor quote for contingencies. In Durham Region&apos;s older housing stock (1960s–1990s), hidden issues behind walls are common — old plumbing, outdated wiring, moisture damage. These surprises are more common than not. A 20% contingency budget makes surprises manageable rather than catastrophic.
            </p>
          </div>
        </div>
      </section>

      {/* Permits */}
      <section id="permits" className="py-16 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3">Permits in Durham Region</h2>
          <p className="text-gray-600 mb-6">Every Durham municipality processes permits independently. Here&apos;s what you need to know.</p>

          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <div className="bg-red-50 rounded-xl p-5 border border-red-200">
              <h3 className="font-bold text-red-900 mb-3">Always Requires a Permit</h3>
              <ul className="space-y-1 text-sm text-red-800">
                {['Basement finishing (framing, electrical, plumbing)', 'Creating a secondary suite', 'Decks over 24" high or attached to house', 'Structural changes (removing/adding walls)', 'Adding or moving plumbing', 'Electrical panel upgrades', 'Home additions', 'HVAC system additions'].map((item) => (
                  <li key={item} className="flex items-start gap-1"><span className="font-bold mt-0.5">✕</span> {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-green-50 rounded-xl p-5 border border-green-200">
              <h3 className="font-bold text-green-900 mb-3">Typically No Permit Required</h3>
              <ul className="space-y-1 text-sm text-green-800">
                {['Interior painting', 'Flooring replacement', 'Cabinet replacement (no plumbing changes)', 'Replacing fixtures in same location', 'Counter and backsplash replacement', 'Appliance replacement', 'Window replacement (same opening size)', 'Most cosmetic work'].map((item) => (
                  <li key={item} className="flex items-start gap-1"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> {item}</li>
                ))}
              </ul>
            </div>
          </div>

          <Link href="/renovation-permit-guide-durham-region" className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 font-bold">
            View the Complete Durham Region Permit Guide with All Municipal Contacts →
          </Link>
        </div>
      </section>

      {/* Contractors */}
      <section id="contractors" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3">Finding Contractors in Durham Region</h2>
          <p className="text-gray-600 mb-8">A step-by-step guide to finding reliable, fairly-priced contractors across Durham Region.</p>

          <div className="grid md:grid-cols-2 gap-5 mb-8">
            {[
              {
                step: '1. Get an AI Benchmark',
                icon: '🤖',
                desc: 'Before contacting any contractor, get a free AI estimate from QuoteXbert. This gives you a data-driven benchmark so you know if quotes are reasonable.',
              },
              {
                step: '2. Collect 3+ Quotes',
                icon: '📋',
                desc: 'For any project over $5,000, get at least 3 detailed quotes. Compare line-by-line scope, not just totals. Price gaps of 30%+ for identical work are common.',
              },
              {
                step: '3. Verify Credentials',
                icon: '✅',
                desc: 'Confirm Ontario licence (for licensed trades), WSIB coverage (wsib.ca), and liability insurance. QuoteXbert verifies all of this automatically for listed contractors.',
              },
              {
                step: '4. Check References',
                icon: '📞',
                desc: 'Call recent references — not just read reviews. Ask specifically about timeline adherence, how surprises were handled, and whether the final cost matched the quote.',
              },
              {
                step: '5. Review the Contract',
                icon: '📝',
                desc: 'Never proceed without a detailed written contract. Must include: scope, timeline, payment milestones (not all upfront), change order process, and warranty.',
              },
              {
                step: '6. Watch for Red Flags',
                icon: '⚠️',
                desc: 'Walk away if: contractor asks 50%+ upfront, suggests skipping permits, cannot provide WSIB/insurance proof, or pressures for immediate commitment.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{item.icon}</span>
                  <h3 className="font-bold text-gray-900 text-sm">{item.step}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/durham-region-contractors" className="bg-rose-600 text-white font-bold px-5 py-2 rounded-xl text-sm hover:bg-rose-700 transition-colors">
              Browse Verified Durham Contractors →
            </Link>
            <Link href="/blog/hiring-contractors-durham-region" className="border border-gray-300 text-gray-700 font-semibold px-5 py-2 rounded-xl text-sm hover:border-rose-300 hover:text-rose-600 transition-colors">
              Read: Hiring Contractors in Durham Region →
            </Link>
          </div>
        </div>
      </section>

      {/* Market Insights */}
      <section id="insights" className="py-16 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3">Durham Region Renovation Market Insights</h2>
          <div className="space-y-6">
            {durhamMarketInsights.map((insight) => (
              <div key={insight.title} className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-6 border border-rose-100">
                <h3 className="font-black text-gray-900 mb-3">{insight.title}</h3>
                <p className="text-gray-700 leading-relaxed">{insight.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8">Durham Region Renovation Guide FAQ</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-bold text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#800020] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to Renovate Your Durham Region Home?</h2>
          <p className="text-rose-100 text-xl mb-8">Get a free AI estimate calibrated to your specific Durham city. Know the fair price before talking to any contractor.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors text-lg">
              Get My Free AI Estimate →
            </Link>
            <Link href="/durham-region-contractors" className="border border-white text-white font-semibold px-8 py-4 rounded-2xl hover:bg-rose-700 transition-colors">
              Find Durham Contractors
            </Link>
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">Explore All Durham Region Resources</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { label: 'Durham Region Hub', href: '/durham-region' },
              { label: 'Ontario Cost Guide', href: '/ontario-renovation-cost-guide' },
              { label: 'Durham Renovation Costs', href: '/durham-region-renovation-costs' },
              { label: 'Durham Contractors', href: '/durham-region-contractors' },
              { label: 'Permit Guide', href: '/renovation-permit-guide-durham-region' },
              { label: 'Best ROI Renovations', href: '/best-roi-renovations-durham-region' },
              { label: 'AI Estimates Durham', href: '/ai-renovation-estimates-durham-region' },
              { label: 'All Renovation Guides', href: '/guides' },
              { label: 'Kitchen Calculator', href: '/kitchen-renovation-calculator' },
              { label: 'Basement Calculator', href: '/basement-renovation-calculator' },
              { label: 'Blog', href: '/blog' },
              { label: 'Get a Free Estimate', href: '/create-lead' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 text-sm font-medium px-3 py-2 rounded-lg transition-colors text-center">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Article',
            headline: 'The Complete Durham Region Renovation Guide 2025',
            description: 'Everything you need before renovating your Durham Region home — all cities, permits, costs, contractors, and timelines.',
            author: { '@type': 'Organization', name: 'QuoteXbert' },
            publisher: { '@type': 'Organization', name: 'QuoteXbert', url: 'https://www.quotexbert.com' },
            url: 'https://www.quotexbert.com/durham-region-renovation-guide',
            dateModified: new Date().toISOString().split('T')[0],
          },
          {
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: { '@type': 'Answer', text: faq.a },
            })),
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.quotexbert.com' },
              { '@type': 'ListItem', position: 2, name: 'Durham Region', item: 'https://www.quotexbert.com/durham-region' },
              { '@type': 'ListItem', position: 3, name: 'Complete Renovation Guide', item: 'https://www.quotexbert.com/durham-region-renovation-guide' },
            ],
          },
        ],
      })}} />
    </main>
  );
}
