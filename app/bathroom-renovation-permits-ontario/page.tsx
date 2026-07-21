import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, XCircle, AlertTriangle, Shield, Layers, Wrench } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Do I Need a Permit for My Bathroom Renovation in Ontario? | 2026 Guide',
  description:
    'When you need a building permit for bathroom renovations in Ontario. Cosmetic vs structural work, permit costs by municipality, Durham Region rules, and what happens without a permit.',
  keywords: [
    'bathroom renovation permit Ontario',
    'do I need a permit to renovate my bathroom Ontario',
    'building permit bathroom renovation Ontario',
    'bathroom renovation without permit Ontario',
    'Durham Region bathroom permit',
    'Toronto bathroom renovation permit',
    'when do you need a permit for bathroom renovation',
    'permit for moving plumbing Ontario',
    'building permit cost Ontario bathroom',
    'bathroom permit rules Ontario 2026',
  ],
  openGraph: {
    title: 'Do I Need a Permit for My Bathroom Renovation in Ontario? | 2026',
    description: 'Clear, honest guide on Ontario bathroom renovation permit requirements — by project type and municipality.',
    url: 'https://www.quotexbert.com/bathroom-renovation-permits-ontario',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ontario Bathroom Renovation Permits 2026 | QuoteXbert',
    description: 'When you need a permit and when you don\'t — the complete Ontario bathroom permit guide.',
  },
  alternates: { canonical: 'https://www.quotexbert.com/bathroom-renovation-permits-ontario' },
};

const permitRules = [
  {
    task: 'Replacing tile (floor and walls)',
    needsPermit: false,
    note: 'Cosmetic — no structural or systems work. No permit required.',
  },
  {
    task: 'New vanity and countertop (same location)',
    needsPermit: false,
    note: 'Considered cosmetic if plumbing connections remain in the same location.',
  },
  {
    task: 'Toilet replacement (same location)',
    needsPermit: false,
    note: 'Direct replacement, no permit needed. Work still requires a licensed plumber per Ontario code.',
  },
  {
    task: 'Replacing bathtub or shower (same location, same footprint)',
    needsPermit: false,
    note: 'Same footprint = no permit. Changing size or moving the drain requires a permit.',
  },
  {
    task: 'Replacing exhaust fan or light fixture',
    needsPermit: false,
    note: 'Replacement of an existing device with no new circuits. No permit. Must use a licensed electrician.',
  },
  {
    task: 'Installing a new GFCI outlet in the bathroom',
    needsPermit: true,
    note: 'New circuit or new outlet = electrical permit required. File with the Electrical Safety Authority (ESA).',
  },
  {
    task: 'Moving plumbing (drain relocation, new rough-in)',
    needsPermit: true,
    note: 'Anytime you alter or move DWV (drain, waste, vent) plumbing, a permit is required. Licensed plumber must be on record.',
  },
  {
    task: 'Adding a bathroom where none existed',
    needsPermit: true,
    note: 'Full building permit required. New rough-in plumbing, electrical, and HVAC connections are involved.',
  },
  {
    task: 'Removing or modifying load-bearing walls',
    needsPermit: true,
    note: 'Any structural modification requires a building permit and stamped engineer drawings in most Ontario municipalities.',
  },
  {
    task: 'Radiant heated floor (electric)',
    needsPermit: true,
    note: 'New electrical circuit = ESA permit required. Must be done by a licensed electrician. Often inspected at rough-in.',
  },
  {
    task: 'Converting tub to walk-in shower (new footprint)',
    needsPermit: true,
    note: 'New floor drain location = plumbing permit. Framing changes may also require a building permit.',
  },
  {
    task: 'Adding a second bathroom (basement suite, etc.)',
    needsPermit: true,
    note: 'Building permit + plumbing permit + electrical permit all required. Also triggers fire code review in some municipalities.',
  },
];

const municipalPermitCosts = [
  { city: 'Toronto', cost: '$150 – $500', processing: '5–15 business days', contact: 'toronto.ca/building' },
  { city: 'Oshawa', cost: '$100 – $350', processing: '3–7 business days', contact: 'oshawa.ca/permitting' },
  { city: 'Whitby', cost: '$100 – $350', processing: '3–7 business days', contact: 'whitby.ca/permits' },
  { city: 'Ajax', cost: '$100 – $300', processing: '3–5 business days', contact: 'ajax.ca/permits' },
  { city: 'Pickering', cost: '$100 – $350', processing: '3–7 business days', contact: 'pickering.ca' },
  { city: 'Mississauga', cost: '$150 – $450', processing: '5–10 business days', contact: 'mississauga.ca/permits' },
  { city: 'Brampton', cost: '$150 – $400', processing: '5–10 business days', contact: 'brampton.ca/permits' },
  { city: 'Hamilton', cost: '$100 – $350', processing: '3–8 business days', contact: 'hamilton.ca/permits' },
];

const consequences = [
  {
    issue: 'You cannot sell your home without permit history',
    detail: 'Real estate lawyers conduct title searches that reveal open permits or unpermitted work. Buyers\' home inspectors flag unpermitted bathrooms. You may be required to open walls, pay fines, or have the work re-done by a licensed contractor before the sale closes.',
  },
  {
    issue: 'Home insurance may deny claims',
    detail: 'If unpermitted plumbing or electrical work causes a flood or fire, your insurer can deny the claim citing code violations. A $15,000 bathroom renovation without a required permit could result in a denied $80,000 flood claim.',
  },
  {
    issue: 'Municipal fines and stop-work orders',
    detail: 'Ontario municipalities can issue stop-work orders and fines of $500–$50,000 under the Building Code Act. Retroactive permit fees are typically double the standard rate.',
  },
];

const faqs = [
  {
    q: 'Do I need a permit to tile my bathroom in Ontario?',
    a: 'No. Replacing tile — on the floor or walls — is considered cosmetic work and does not require a building permit in Ontario. This applies to tub surrounds, shower stalls, and floor tile. No permit is needed as long as you are not moving plumbing or altering the structure.',
  },
  {
    q: 'Do I need a permit to replace my toilet in Ontario?',
    a: 'No permit is required for a direct toilet replacement in Ontario — as long as the toilet stays in the same location. However, Ontario\'s Building Code still requires that plumbing work be done by a licensed plumber. The permit requirement applies when the rough-in is being moved or altered.',
  },
  {
    q: 'Do I need a permit to move the shower drain in Ontario?',
    a: 'Yes. Any alteration to drain, waste, and vent (DWV) plumbing — including moving a shower drain — requires a plumbing permit in Ontario municipalities. You must hire a licensed plumber, who will typically pull the permit as part of their work.',
  },
  {
    q: 'What happens if I renovate my bathroom without a required permit in Ontario?',
    a: 'Unpermitted work that required a permit creates problems when you sell: disclosure requirements, potential forced reopening of walls, fines, and in some cases, the work being deemed non-compliant. Insurers can deny claims for damage caused by unpermitted systems. It is always cheaper to pull the permit than to deal with the consequences later.',
  },
  {
    q: 'How much does a bathroom renovation permit cost in Durham Region?',
    a: 'In Durham Region municipalities (Oshawa, Whitby, Ajax, Pickering), a bathroom renovation permit for plumbing or electrical work typically costs $100–$350. Permits for structural work (removing walls, adding a bathroom) cost more. Processing typically takes 3–7 business days for straightforward projects.',
  },
  {
    q: 'Does my contractor pull the permit or do I?',
    a: 'Either party can pull the permit, but for plumbing and electrical work, the licensed tradesperson (plumber, electrician) typically pulls the permit as part of their service. For a general building permit (structural, additions), the homeowner or general contractor usually applies. Always confirm who is responsible before work begins.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Do I Need a Permit for My Bathroom Renovation in Ontario?',
  url: 'https://www.quotexbert.com/bathroom-renovation-permits-ontario',
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

export default function BathroomPermitsPage() {
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
            <span className="text-slate-100">Bathroom Renovation Permits</span>
          </nav>
          <span className="inline-block bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            Permit Guide · Ontario 2026
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight text-white mb-6">
            Do I Need a Permit for My<br className="hidden md:block" /> Bathroom Renovation?
          </h1>
          <p className="text-xl text-slate-200 leading-relaxed max-w-3xl mb-8">
            The definitive Ontario guide — exactly which bathroom renovation tasks require a permit, which don&apos;t, permit costs by city, and what happens if you skip one you needed.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/create-lead" className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-[#990024] transition-all text-lg">
              Find a Licensed Bathroom Contractor <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Answer */}
      <section className="py-10 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2">The One-Sentence Rule</h2>
            <p className="text-slate-700 text-lg">
              <strong>Cosmetic work</strong> (tile, paint, vanity, fixtures in the same location) = <strong>no permit</strong>.<br />
              <strong>Systems work</strong> (moving plumbing, new electrical circuits, structural changes) = <strong>permit required</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Permit Rules Table */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Permit Required? Task-by-Task Guide</h2>
          <p className="text-slate-600 mb-8 text-lg">Based on Ontario Building Code and municipal requirements. July 2026.</p>
          <div className="space-y-3">
            {permitRules.map((rule, i) => (
              <div key={i} className={`flex items-start gap-4 p-5 rounded-xl border ${rule.needsPermit ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
                {rule.needsPermit
                  ? <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                  : <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                }
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <span className="font-bold text-slate-900">{rule.task}</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${rule.needsPermit ? 'bg-amber-200 text-amber-800' : 'bg-green-200 text-green-800'}`}>
                      {rule.needsPermit ? 'PERMIT REQUIRED' : 'NO PERMIT'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{rule.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Permit Costs by City */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Permit Costs by Ontario City</h2>
          <p className="text-slate-600 mb-8 text-lg">For plumbing and electrical permits related to bathroom renovations.</p>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="text-left p-4">Municipality</th>
                  <th className="text-right p-4">Permit Cost</th>
                  <th className="text-right p-4">Processing Time</th>
                  <th className="text-right p-4">Portal</th>
                </tr>
              </thead>
              <tbody>
                {municipalPermitCosts.map((m, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="p-4 font-medium">{m.city}</td>
                    <td className="p-4 text-right">{m.cost}</td>
                    <td className="p-4 text-right">{m.processing}</td>
                    <td className="p-4 text-right">
                      <span className="text-[#800020] text-xs">{m.contact}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-2">Costs are estimates. Contact your municipality for current fee schedules. Plumbing permits are filed by the licensed plumber; ESA permits by the electrician.</p>
        </div>
      </section>

      {/* Consequences */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-3">What Happens If You Skip a Required Permit</h2>
          <p className="text-slate-600 mb-8 text-lg">The short-term savings are not worth it.</p>
          <div className="space-y-4">
            {consequences.map((c, i) => (
              <div key={i} className="bg-red-50 border border-red-200 rounded-xl p-5 flex gap-4">
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{c.issue}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#800020] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Shield className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-3xl font-black mb-4">Work With Contractors Who Know the Rules</h2>
          <p className="text-lg text-rose-100 mb-8">
            QuoteXbert connects Ontario homeowners with licensed, insured contractors who pull the required permits as part of their work — protecting your investment and your insurance.
          </p>
          <Link href="/create-lead" className="inline-flex items-center gap-2 bg-white text-[#800020] font-black px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all text-lg">
            Find a Licensed Bathroom Contractor <ArrowRight className="w-5 h-5" />
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
          <h2 className="text-2xl font-black text-slate-900 mb-8">Related Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link href="/renovation-permit-guide-durham-region" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#800020] hover:shadow-md transition-all group">
              <Layers className="w-8 h-8 text-amber-500 mb-3" />
              <h3 className="font-bold text-slate-900 group-hover:text-[#800020] mb-1">Durham Region Permit Guide</h3>
              <p className="text-sm text-slate-500">All Durham municipalities, permit contacts, and processing times</p>
            </Link>
            <Link href="/can-i-renovate-my-bathroom-for-10000-ontario" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#800020] hover:shadow-md transition-all group">
              <Wrench className="w-8 h-8 text-[#800020] mb-3" />
              <h3 className="font-bold text-slate-900 group-hover:text-[#800020] mb-1">Can I Renovate for $10,000?</h3>
              <p className="text-sm text-slate-500">Budget reality check for Ontario bathroom renovations</p>
            </Link>
            <Link href="/bathroom-renovation-financing-ontario" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#800020] hover:shadow-md transition-all group">
              <Shield className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-900 group-hover:text-[#800020] mb-1">Bathroom Renovation Financing</h3>
              <p className="text-sm text-slate-500">HELOC, loans, and payment plan comparison</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
