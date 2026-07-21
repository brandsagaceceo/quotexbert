'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calculator } from 'lucide-react';

const CITIES = ['Toronto Core', 'Durham Region (Oshawa/Whitby)', 'Ajax / Pickering', 'Hamilton', 'Ottawa', 'Kitchener / Waterloo'];
const CITY_MULT: Record<string, number> = { 'Toronto Core': 1.0, 'Durham Region (Oshawa/Whitby)': 0.84, 'Ajax / Pickering': 0.87, 'Hamilton': 0.82, 'Ottawa': 0.87, 'Kitchener / Waterloo': 0.81 };

const BASEMENT_SIZES = [
  { label: 'Small (< 600 sq ft)', sqft: 500 },
  { label: 'Average (600–800 sq ft)', sqft: 700 },
  { label: 'Large (800–1,000 sq ft)', sqft: 900 },
  { label: 'Full Basement (1,000+ sq ft)', sqft: 1100 },
];
const BASE_PER_SQFT = 42;

const SCOPE = [
  { label: 'Open-Concept Finish (no bathroom)', extra: 0, desc: 'Rec room, office, or family space' },
  { label: 'With Bedroom & 3-piece Bathroom', extra: 14000, desc: 'Most popular choice' },
  { label: 'Full Legal Rental Suite', extra: 28000, desc: 'Kitchen, bath, separate entrance' },
];

export default function BasementRenovationCalculatorPage() {
  const [sizeIdx, setSizeIdx] = useState(1);
  const [scopeIdx, setScopeIdx] = useState(1);
  const [cityKey, setCityKey] = useState('Durham Region (Oshawa/Whitby)');
  const [separateEntrance, setSeparateEntrance] = useState(false);

  const selectedSize = BASEMENT_SIZES[sizeIdx] ?? BASEMENT_SIZES[1]!;
  const selectedScope = SCOPE[scopeIdx] ?? SCOPE[1]!;
  const cityMultiplier = CITY_MULT[cityKey] ?? 1;
  const sqft = selectedSize.sqft;
  const base = sqft * BASE_PER_SQFT * cityMultiplier;
  const extras = selectedScope.extra + (separateEntrance ? 9000 : 0);
  const low = Math.round((base + extras) * 0.85 / 500) * 500;
  const high = Math.round((base + extras) * 1.25 / 500) * 500;
  const mid = Math.round((low + high) / 2 / 500) * 500;
  const fmt = (n: number) => `$${n.toLocaleString()}`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-rose-600">Home</Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/guides" className="hover:text-rose-600">Guides</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Basement Calculator</span>
          </nav>

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-sm mb-4">
              <Calculator className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-700">Free Basement Renovation Calculator</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
              Basement Renovation<br />Cost Calculator
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Estimate basement finishing costs for Ontario homes — from open-concept rec rooms to legal rental suites.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Basement Size</label>
                  <div className="space-y-2">
                    {BASEMENT_SIZES.map((s, i) => (
                      <button key={s.label} onClick={() => setSizeIdx(i)}
                        className={`w-full p-3 text-sm rounded-lg border text-left transition-colors ${sizeIdx === i ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold' : 'border-gray-200 hover:border-rose-300'}`}>
                        {s.label} <span className="text-gray-400 font-normal">({s.sqft} sq ft)</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Project Scope</label>
                  <div className="space-y-2">
                    {SCOPE.map((s, i) => (
                      <button key={s.label} onClick={() => setScopeIdx(i)}
                        className={`w-full p-3 text-sm rounded-lg border text-left transition-colors ${scopeIdx === i ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold' : 'border-gray-200 hover:border-rose-300'}`}>
                        <div className="font-semibold">{s.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{s.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your City</label>
                  <select value={cityKey} onChange={(e) => setCityKey(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg text-base">
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {scopeIdx === 2 && (
                  <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-rose-300">
                    <input type="checkbox" checked={separateEntrance} onChange={(e) => setSeparateEntrance(e.target.checked)} className="mt-0.5 accent-rose-600" />
                    <div><div className="font-semibold text-sm">Add Separate Exterior Entrance</div><div className="text-xs text-gray-500">Excavation, stairs, door — adds ~$9,000</div></div>
                  </label>
                )}
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-gray-900 text-lg mb-6">Your Estimated Range</h3>
                  <div className="bg-[#800020] rounded-2xl p-6 text-white mb-4">
                    <p className="text-rose-100 text-sm mb-1">Estimated Basement Renovation Cost</p>
                    <p className="text-4xl font-black mb-1">{fmt(mid)}</p>
                    <p className="text-rose-200 text-sm">Range: {fmt(low)} – {fmt(high)}</p>
                  </div>

                  {scopeIdx === 2 && (
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200 mb-4">
                      <p className="text-sm font-bold text-green-800 mb-1">💰 Rental Income Potential</p>
                      <p className="text-sm text-green-700">Legal suites in Ontario rent for $1,400–$2,000/month. Break-even: <strong>{Math.round(mid / 1700)} months</strong> at average rent.</p>
                    </div>
                  )}

                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mb-4">
                    <p className="text-xs font-bold text-amber-700 mb-1">⚠️ Important: Always get permits</p>
                    <p className="text-xs text-amber-800">Basement finishing requires permits in all Ontario municipalities. Budget $600–$2,000 for permit fees.</p>
                  </div>
                </div>
                <Link href="/create-lead" className="bg-[#800020] text-white font-bold px-6 py-4 rounded-2xl hover:shadow-lg transition-all text-center block">
                  📸 Get Accurate AI Estimate (Free) →
                </Link>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="font-black text-gray-900">About Basement Renovation Costs in Ontario</h2>
            <p>Basement finishing costs in Ontario range from $18,000 (basic open-concept) to $85,000+ (legal rental suite with separate entrance). The biggest cost drivers are basement size, scope (open-concept vs. with bathroom vs. full suite), and whether a separate entrance is added.</p>
            <h3>Rental Suite ROI in Ontario</h3>
            <p>Ontario&apos;s strong rental market makes legal basement suites one of the best investment renovations in the province. Durham Region suites rent for $1,400–$2,000/month. A $55,000 suite generating $1,700/month breaks even in about 2.7 years — after that, it&apos;s pure income.</p>
            <h3>Permit Requirements</h3>
            <p>Basement finishing always requires a building permit in Ontario municipalities. This is non-negotiable — unpermitted basement work must be disclosed at home sale and can void insurance. Budget $600–$2,000 for permit fees and allow 3–6 weeks for permit approval.</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { label: 'Basement Renovation Oshawa', href: '/basement-renovation-oshawa' },
              { label: 'Basement Renovation Whitby', href: '/basement-renovation-whitby' },
              { label: 'Should You Finish Your Basement?', href: '/blog/should-you-finish-your-basement' },
              { label: 'Ontario Cost Guide', href: '/ontario-renovation-cost-guide' },
              { label: 'Kitchen Calculator', href: '/kitchen-renovation-calculator' },
              { label: 'All Guides', href: '/guides' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
