import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, FileText, MapPin, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Durham Region Renovation Permit Guide | All Municipalities | QuoteXbert',
  description:
    'Complete renovation permit guide for Durham Region, Ontario. When you need permits, how to apply, permit costs, and permit contacts for Oshawa, Whitby, Ajax, Pickering, and Clarington.',
  keywords: [
    'Durham Region renovation permits',
    'Oshawa building permit',
    'Whitby building permit',
    'Ajax building permit',
    'Pickering building permit',
    'Clarington building permit',
    'Durham Region permit guide',
    'Ontario renovation permits',
  ],
  openGraph: {
    title: 'Durham Region Renovation Permit Guide | QuoteXbert',
    description: 'Complete permit guide for Durham Region renovations. Every municipality covered with contact info and requirements.',
    url: 'https://www.quotexbert.com/renovation-permit-guide-durham-region',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Durham Region Renovation Permit Guide | QuoteXbert', description: 'When you need permits for Durham Region renovations — and how to get them.' },
  alternates: { canonical: 'https://www.quotexbert.com/renovation-permit-guide-durham-region' },
};

const municipalContacts = [
  {
    city: 'Oshawa',
    dept: 'City of Oshawa Development Services',
    phone: '905-436-3311',
    website: 'oshawa.ca/building',
    note: 'Online permit applications accepted. Typical processing 5–10 business days for residential projects.',
  },
  {
    city: 'Whitby',
    dept: 'Town of Whitby Building Services',
    phone: '905-430-4300',
    website: 'whitby.ca/building',
    note: 'ePermit portal available for most residential permit applications. Processing 5–15 business days.',
  },
  {
    city: 'Ajax',
    dept: 'Town of Ajax Building Services',
    phone: '905-619-2529',
    website: 'ajax.ca/building',
    note: 'Online applications available. Processing 5–10 business days for standard residential projects.',
  },
  {
    city: 'Pickering',
    dept: 'City of Pickering Building Services',
    phone: '905-420-4617',
    website: 'pickering.ca/building',
    note: 'MyPickering portal for online applications. Processing 5–15 business days for residential permits.',
  },
  {
    city: 'Clarington (Bowmanville, Courtice, Newcastle)',
    dept: 'Municipality of Clarington Building Services',
    phone: '905-623-3379',
    website: 'clarington.net/building',
    note: 'Serves Bowmanville, Courtice, Newcastle, and all Clarington communities. Processing 5–15 business days.',
  },
  {
    city: 'Scugog (Port Perry)',
    dept: 'Township of Scugog Building',
    phone: '905-985-7346',
    website: 'scugog.ca/building',
    note: 'Smaller municipality — processing times can vary. Call ahead to confirm current timelines.',
  },
  {
    city: 'Uxbridge',
    dept: 'Township of Uxbridge Building',
    phone: '905-852-9181',
    website: 'uxbridge.ca/building',
    note: 'Rural municipality — building permit processing typically 10–15 business days.',
  },
  {
    city: 'Brock (Cannington, Beaverton)',
    dept: 'Township of Brock Building',
    phone: '705-432-2355',
    website: 'townshipofbrock.ca',
    note: 'North Durham rural municipality. Contact for current processing timelines.',
  },
];

const projectsRequiringPermits = [
  {
    category: 'Structural Work',
    projects: ['Removing or adding load-bearing walls', 'Building additions or extensions', 'Garage conversions to living space', 'Structural repairs to foundations or beams'],
  },
  {
    category: 'Basement & Secondary Suites',
    projects: ['Basement finishing (framing, drywall, electrical)', 'Creating a secondary suite or basement apartment', 'Adding a separate entrance', 'Installing egress windows in basements'],
  },
  {
    category: 'Plumbing',
    projects: ['Adding a new bathroom', 'Moving plumbing drain lines or supply pipes', 'Installing new fixtures in new locations', 'Adding a kitchen or kitchenette'],
  },
  {
    category: 'Electrical',
    projects: ['Electrical panel upgrades', 'Adding new circuits', 'Rough-in electrical for new spaces', 'Installing EV chargers (often requires permit)'],
  },
  {
    category: 'Exterior & Decks',
    projects: ['Decks over 24 inches (60cm) above grade', 'Decks attached to the house', 'Adding windows or doors (changing opening size)', 'New garages or carports'],
  },
  {
    category: 'HVAC',
    projects: ['Installing new furnace or HVAC systems', 'Adding A/C to home without existing A/C', 'Installing heat pumps', 'Altering ductwork significantly'],
  },
];

const projectsNotRequiringPermits = [
  'Interior painting',
  'Flooring replacement (same footprint)',
  'Cabinet replacement (same locations, no plumbing changes)',
  'Replacing existing fixtures in the same location',
  'Counter/backsplash replacement',
  'Replacing appliances',
  'Window replacement (same size opening)',
  'Landscaping and fencing (most types)',
  'Small decks under 24 inches above grade, not attached to house',
];

const permitCosts = [
  { project: 'Basement Finishing', range: '$500 – $1,800' },
  { project: 'Secondary Suite', range: '$1,000 – $2,500' },
  { project: 'Deck Construction', range: '$200 – $600' },
  { project: 'Home Addition (per sq m)', range: '$15 – $40/sq m' },
  { project: 'Kitchen with Plumbing Changes', range: '$400 – $1,200' },
  { project: 'New Bathroom Addition', range: '$500 – $1,500' },
  { project: 'Electrical Panel Upgrade', range: '$150 – $400' },
];

const faqs = [
  {
    q: 'Do I need a permit for a kitchen renovation in Durham Region?',
    a: "A kitchen renovation in Durham Region requires a permit if it involves: moving plumbing (drain lines or supply pipes), electrical panel upgrades, structural changes (removing walls), or adding new electrical circuits. Cosmetic work — new cabinets, countertops, appliances, paint, flooring — generally doesn't require a permit. When in doubt, call your local municipal building department.",
  },
  {
    q: 'What happens if I renovate without a permit in Durham Region?',
    a: "Renovating without a required permit in Durham Region can result in: fines from the municipality, being ordered to open walls for inspection (costly), unpermitted work disclosure requirements at home sale, insurance claim issues if the unpermitted work is involved, and lender financing issues. Always permit required work — it costs far less than the consequences.",
  },
  {
    q: 'How long do permits take in Durham Region?',
    a: "Permit processing times in Durham Region vary by municipality and project type. Simple residential permits (deck, basement finish) typically take 5–15 business days. Complex projects (additions, secondary suites) may take 3–6 weeks. Apply for permits early — they must be approved before work begins, and delays can push your project start date significantly.",
  },
  {
    q: "Should my contractor pull the permit, or do I?",
    a: "Either the homeowner or contractor can apply for building permits in Durham Region. In practice, most reputable contractors handle permit applications as part of their service. This is important because the contractor is responsible for ensuring work passes inspections. If a contractor suggests you pull the permit yourself while they do the work, that's a red flag — it may indicate they're not licensed for the work.",
  },
  {
    q: 'What is the difference between a building permit and a trade permit in Durham Region?',
    a: "Building permits are for structural, architectural, and general construction work. Trade permits are issued separately for electrical work (by the Electrical Safety Authority, ESA) and plumbing work (by the municipality or province). Most major renovation projects require both a building permit and separate trade permits. Your contractor should know which permits are needed for your specific project.",
  },
];

export default function RenovationPermitGuideDurhamPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10" />
        <div className="max-w-6xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-rose-600">Home</Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/durham-region" className="hover:text-rose-600">Durham Region</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Permit Guide</span>
          </nav>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <FileText className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-900">Complete Durham Region Permit Guide</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="text-[#800020]">
                Renovation Permits in<br />Durham Region, Ontario
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Everything Durham Region homeowners need to know about building permits.
              When you need them, how to apply, how much they cost, and who to call
              in every Durham municipality.
            </p>

            <div className="pt-4">
              <Link href="/create-lead" className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg">
                📸 Get My Free AI Renovation Estimate <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Requiring Permits */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">What Requires a Permit in Durham Region?</h2>
          <p className="text-center text-gray-600 mb-10">Projects that require building permits across all Durham municipalities</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projectsRequiringPermits.map((cat) => (
              <div key={cat.category} className="bg-red-50 rounded-xl p-5 border border-red-200">
                <h3 className="font-bold text-red-900 mb-3 text-sm uppercase tracking-wide">{cat.category}</h3>
                <ul className="space-y-1">
                  {cat.projects.map((p) => (
                    <li key={p} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-red-500 mt-0.5 flex-shrink-0">✕</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects NOT requiring permits */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">What Doesn&apos;t Need a Permit?</h2>
          <p className="text-center text-gray-600 mb-8">These projects generally don&apos;t require permits in Durham Region (always confirm with your municipality)</p>
          <div className="bg-white rounded-xl p-6 border border-green-200">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {projectsNotRequiringPermits.map((p) => (
                <div key={p} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {p}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">* Always verify with your specific municipality — requirements can change. When in doubt, call before starting work.</p>
          </div>
        </div>
      </section>

      {/* Permit Costs */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Permit Costs in Durham Region</h2>
          <p className="text-center text-gray-600 mb-8">Approximate permit fees across Durham municipalities</p>
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-rose-600 text-white">
                  <th className="text-left px-4 py-3 font-bold">Project Type</th>
                  <th className="text-right px-4 py-3 font-bold">Permit Cost Range</th>
                </tr>
              </thead>
              <tbody>
                {permitCosts.map((item, i) => (
                  <tr key={item.project} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-3 text-gray-900">{item.project}</td>
                    <td className="px-4 py-3 text-right font-bold text-rose-700">{item.range}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">* Permit costs vary by municipality and project scope. These are estimates — contact your municipal building department for accurate quotes.</p>
        </div>
      </section>

      {/* Municipal Contacts */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Durham Region Building Permit Contacts</h2>
          <p className="text-center text-gray-600 mb-10">Contact information for every Durham Region municipality&apos;s building services department</p>
          <div className="grid md:grid-cols-2 gap-5">
            {municipalContacts.map((muni) => (
              <div key={muni.city} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <MapPin className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                  <h3 className="font-bold text-gray-900">{muni.city}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">{muni.dept}</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-rose-700 mb-2">
                  <Phone className="w-4 h-4" />
                  <span>{muni.phone}</span>
                </div>
                <p className="text-xs text-gray-500">{muni.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Durham Region Permit FAQ</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="font-bold text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#800020] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Work with Permit-Savvy Durham Contractors</h2>
          <p className="text-rose-100 text-lg mb-8">QuoteXbert-connected contractors know Durham Region permit requirements and handle applications as part of their service. Get a free AI estimate and find verified contractors.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors">Get My Free AI Estimate →</Link>
            <Link href="/durham-region-contractors" className="border border-white text-white font-semibold px-8 py-4 rounded-2xl hover:bg-rose-700 transition-colors">Find Durham Contractors</Link>
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">Related Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Durham Region Hub', href: '/durham-region' },
              { label: 'Durham Renovation Costs', href: '/durham-region-renovation-costs' },
              { label: 'Durham Contractors', href: '/durham-region-contractors' },
              { label: 'Renovation Checklist Ontario', href: '/blog/home-renovation-checklist-ontario' },
              { label: 'Hiring Contractors Durham', href: '/blog/hiring-contractors-durham-region' },
              { label: 'Oshawa', href: '/oshawa' },
              { label: 'Whitby', href: '/whitby' },
              { label: 'Ajax', href: '/ajax' },
              { label: 'Pickering', href: '/pickering' },
              { label: 'Get a Free Estimate', href: '/create-lead' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
