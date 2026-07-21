import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, XCircle, AlertTriangle, Shield, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Do I Need Permits to Finish My Basement in Ontario? | 2026 Guide',
  description:
    'When you need a building permit to finish your basement in Ontario. Open-concept, bathroom, legal suite, bedroom — exact permit requirements by project type and Ontario municipality.',
  keywords: [
    'do I need permits to finish my basement Ontario',
    'basement renovation permit Ontario',
    'permit to finish basement Ontario',
    'do I need a building permit for basement Ontario',
    'basement permit cost Ontario',
    'legal basement suite permit Ontario',
    'Durham Region basement permit',
    'Toronto basement finishing permit',
    'basement renovation without permit Ontario',
    'Ontario basement permit requirements 2026',
  ],
  openGraph: {
    title: 'Do I Need Permits to Finish My Basement in Ontario? | 2026',
    description: 'Clear guide on Ontario basement permit requirements — by project type, municipality, and what happens without one.',
    url: 'https://www.quotexbert.com/do-i-need-permits-to-finish-my-basement-ontario',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Basement Permits Ontario 2026 | QuoteXbert',
    description: 'When you need a permit to finish your basement in Ontario — full 2026 guide.',
  },
  alternates: { canonical: 'https://www.quotexbert.com/do-i-need-permits-to-finish-my-basement-ontario' },
};

const permitRules = [
  { task: 'Framing new walls in basement', needsPermit: true, note: 'Any new partition walls require a building permit in Ontario municipalities.' },
  { task: 'Insulating exterior basement walls', needsPermit: true, note: 'Considered a building alteration. Permit required. Inspected before drywall.' },
  { task: 'Installing drywall on framed walls', needsPermit: true, note: 'Drywall installation is inspected to verify insulation, vapour barrier, and fire separation are correct before covering.' },
  { task: 'Adding pot lights (new circuits)', needsPermit: true, note: 'New electrical circuits require an Electrical Safety Authority (ESA) permit. Must be done by a licensed electrician.' },
  { task: 'Adding a basement bathroom', needsPermit: true, note: 'New plumbing rough-in requires a plumbing permit. Electrical for GFCI outlets and exhaust fan requires an ESA permit.' },
  { task: 'Adding a bedroom in the basement', needsPermit: true, note: 'An enclosed bedroom requires a building permit. Egress window in the bedroom is mandatory under Ontario Building Code.' },
  { task: 'Creating a legal secondary suite', needsPermit: true, note: 'Always requires a building permit. Also triggers fire separation requirements (fireproofed ceiling and walls between floors).' },
  { task: 'Adding a separate basement entrance', needsPermit: true, note: 'Exterior door or stairwell addition is a structural alteration — building permit required.' },
  { task: 'Replacing existing HVAC registers/ducts', needsPermit: false, note: 'Extending existing ductwork to new basement spaces does require review but not always a separate permit in all municipalities. Confirm locally.' },
  { task: 'Painting unfinished basement', needsPermit: false, note: 'Paint only — no structural or systems work. No permit.' },
  { task: 'Installing a sump pump', needsPermit: false, note: 'Replacing like-for-like typically no permit. Adding a new one may need a minor plumbing permit. Check locally.' },
  { task: 'Installing LVP/carpet flooring over concrete', needsPermit: false, note: 'Cosmetic floor covering over existing concrete slab — no permit.' },
];

const municipalInfo = [
  { city: 'Toronto', cost: '$500 – $2,500', time: '10–20 business days', suiteSpecific: 'Secondary suites require zoning compliance review + fire inspection.', contact: 'toronto.ca/building' },
  { city: 'Oshawa', cost: '$350 – $1,200', time: '5–10 business days', suiteSpecific: 'Basement suites allowed in most R1/R2 zones. Contact (905) 436-3311.', contact: 'oshawa.ca' },
  { city: 'Whitby', cost: '$350 – $1,200', time: '5–10 business days', suiteSpecific: 'Accessory apartments permitted. Secondary suite register required.', contact: 'whitby.ca' },
  { city: 'Ajax', cost: '$300 – $1,100', time: '5–8 business days', suiteSpecific: 'Secondary suites allowed by right in most zones.', contact: 'ajax.ca' },
  { city: 'Mississauga', cost: '$450 – $1,800', time: '7–14 business days', suiteSpecific: 'Zoning bylaw review required for secondary suites.', contact: 'mississauga.ca' },
  { city: 'Hamilton', cost: '$350 – $1,400', time: '5–10 business days', suiteSpecific: 'Additional Dwelling Units (ADUs) encouraged by city policy.', contact: 'hamilton.ca' },
];

const eggressRules = [
  { rule: 'Every bedroom in a basement must have an egress window', detail: 'Ontario Building Code requires a minimum opening of 0.35 sq m (3.77 sq ft) with no dimension less than 380mm (15 inches). The sill must be no more than 1,000mm (39 inches) from the floor.' },
  { rule: 'Legal secondary suites must have a separate entrance', detail: 'Either an interior staircase that is separated from the upper unit, or a dedicated exterior entrance. The entrance must meet minimum clear width requirements.' },
  { rule: 'Fire separation between floors is mandatory for legal suites', detail: 'The ceiling of the basement suite (floor of the upper unit) must achieve a minimum fire-resistance rating, typically 30–45 minutes. This usually requires specific drywall thickness and sometimes spray foam or mineral wool insulation.' },
  { rule: 'Smoke and CO detectors are required on every level', detail: 'Ontario requires interconnected smoke alarms on every storey and carbon monoxide detectors adjacent to all sleeping areas. Legal suites require their own independent alarm system.' },
];

const faqs = [
  {
    q: 'Do I always need a permit to finish my basement in Ontario?',
    a: 'For most basement finishing work, yes. Framing walls, insulating, adding bathrooms, adding bedrooms, and creating legal suites all require building permits in Ontario municipalities. Simple cosmetic work (painting, floor coverings on existing concrete) does not require a permit. When in doubt, call your local building department — it is a free question.',
  },
  {
    q: 'What happens if I finish my basement without a permit in Ontario?',
    a: 'Finishing your basement without a required permit creates serious problems: you cannot legally advertise or rent an unpermitted suite; your insurer can deny claims for damage from unpermitted work; and when you sell, unpermitted work must be disclosed and may require expensive remediation. Retroactive permits cost double the standard fee and may require opening walls.',
  },
  {
    q: 'How much does a basement renovation permit cost in Ontario?',
    a: 'In Ontario municipalities, a building permit for a basement finishing project typically costs $350–$2,500 depending on the scope. A simple open-concept finish is at the lower end ($350–$700). A legal secondary suite permit costs $800–$2,500 in most GTA municipalities due to the additional reviews required. Toronto is typically at the high end.',
  },
  {
    q: 'Do I need permits to finish my basement in Durham Region?',
    a: 'Yes. In all Durham Region municipalities (Oshawa, Whitby, Ajax, Pickering, Clarington, Scugog, Brock, Uxbridge), a building permit is required for basement finishing that includes framing, insulation, electrical, or plumbing. Permit fees in Durham Region are typically $350–$1,200, lower than Toronto. Processing takes 5–10 business days for standard projects.',
  },
  {
    q: 'Do I need a permit to add a second bathroom in my basement?',
    a: 'Yes. Adding a new bathroom requires a plumbing permit (pulled by your licensed plumber) and an electrical permit for GFCI outlets and the exhaust fan (pulled by your electrician). A building permit may also be required if walls are being added or altered. Your contractor should coordinate all permit applications.',
  },
  {
    q: 'Can my contractor pull the basement renovation permit?',
    a: 'Yes — either the homeowner or the general contractor can pull the building permit. For plumbing work, the licensed plumber pulls the plumbing permit as part of their scope. For electrical, the licensed electrician pulls the ESA permit. Confirm who is responsible for each permit type before signing the contract.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Do I Need Permits to Finish My Basement in Ontario?',
  url: 'https://www.quotexbert.com/do-i-need-permits-to-finish-my-basement-ontario',
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

export default function BasementPermitsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-[#1e1b21] to-[#2d0008] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(128,0,32,0.15),transparent_50%)]" />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-300 mb-8">
            <Link href="/" className="hover:text-amber-400">Home</Link>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <Link href="/guides" className="hover:text-amber-400">Guides</Link>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-100">Basement Permits Ontario</span>
          </nav>
          <span className="inline-block bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            Permit Guide · Ontario 2026
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight text-white mb-6">
            Do I Need Permits to Finish<br className="hidden md:block" /> My Basement in Ontario?
          </h1>
          <p className="text-xl text-slate-200 leading-relaxed max-w-3xl mb-8">
            The definitive 2026 guide — exactly which basement work requires a permit, permit costs by municipality, egress window rules, and what happens if you skip one you needed.
          </p>
          <Link href="/create-lead" className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-[#990024] transition-all text-lg">
            Find a Permit-Compliant Contractor <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Quick Answer */}
      <section className="py-10 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Short Answer</h2>
            <p className="text-slate-700 text-lg">
              <strong>Yes — almost always.</strong> Any basement work that includes framing, insulation, electrical, plumbing, or creating a bedroom or bathroom requires a building permit in Ontario. The only exception is purely cosmetic work (paint, flooring on existing concrete).
            </p>
          </div>
        </div>
      </section>

      {/* Permit Rules */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Permit Required? Task-by-Task</h2>
          <p className="text-slate-600 mb-8 text-lg">Based on Ontario Building Code and standard municipal requirements.</p>
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

      {/* Egress Rules */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Ontario Building Code Rules for Basement Bedrooms & Suites</h2>
          <p className="text-slate-600 mb-8 text-lg">These requirements are non-negotiable and inspector-verified.</p>
          <div className="space-y-4">
            {eggressRules.map((r, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex gap-4">
                <Shield className="w-6 h-6 text-[#800020] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{r.rule}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{r.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Municipal Costs */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Basement Permit Costs by Ontario City</h2>
          <p className="text-slate-600 mb-8 text-lg">Approximate fees for basement finishing and secondary suite permits.</p>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="text-left p-4">Municipality</th>
                  <th className="text-right p-4">Permit Cost</th>
                  <th className="text-right p-4">Processing</th>
                  <th className="text-left p-4 hidden md:table-cell">Suite Notes</th>
                </tr>
              </thead>
              <tbody>
                {municipalInfo.map((m, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="p-4 font-medium">{m.city}</td>
                    <td className="p-4 text-right">{m.cost}</td>
                    <td className="p-4 text-right">{m.time}</td>
                    <td className="p-4 text-xs text-slate-500 hidden md:table-cell">{m.suiteSpecific}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-2">Fees are estimates. Contact your municipality for current schedules. Secondary suite permits at higher end of range.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#800020] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Shield className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-3xl font-black mb-4">Work With Contractors Who Handle Permits Properly</h2>
          <p className="text-lg text-rose-100 mb-8">QuoteXbert contractors are verified and experienced with Ontario permit requirements. Your project will be done right — with all required permits included in the quoted price.</p>
          <Link href="/create-lead" className="inline-flex items-center gap-2 bg-white text-[#800020] font-black px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all text-lg">
            Find a Licensed Basement Contractor <ArrowRight className="w-5 h-5" />
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
          <h2 className="text-2xl font-black text-slate-900 mb-8">Related Basement Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link href="/how-much-does-it-cost-to-finish-a-basement-in-ontario" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#800020] hover:shadow-md transition-all group">
              <Home className="w-8 h-8 text-[#800020] mb-3" />
              <h3 className="font-bold text-slate-900 group-hover:text-[#800020] mb-1">Basement Finishing Cost Ontario</h3>
              <p className="text-sm text-slate-500">Per-square-foot pricing for all project types</p>
            </Link>
            <Link href="/basement-suite-vs-open-concept-ontario" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#800020] hover:shadow-md transition-all group">
              <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-bold text-slate-900 group-hover:text-[#800020] mb-1">Legal Suite vs. Open Concept</h3>
              <p className="text-sm text-slate-500">Which basement layout adds more value in Ontario?</p>
            </Link>
            <Link href="/renovation-permit-guide-durham-region" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#800020] hover:shadow-md transition-all group">
              <XCircle className="w-8 h-8 text-amber-500 mb-3" />
              <h3 className="font-bold text-slate-900 group-hover:text-[#800020] mb-1">Durham Region Permit Guide</h3>
              <p className="text-sm text-slate-500">All Durham municipalities, contacts, and fees</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
