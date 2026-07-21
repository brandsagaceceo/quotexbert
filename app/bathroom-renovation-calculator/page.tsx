'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calculator } from 'lucide-react';

const CITIES = ['Toronto Core', 'Durham Region (Oshawa/Whitby)', 'Ajax / Pickering', 'Hamilton', 'Ottawa', 'Kitchener / Waterloo'];
const CITY_MULT: Record<string, number> = { 'Toronto Core': 1.0, 'Durham Region (Oshawa/Whitby)': 0.85, 'Ajax / Pickering': 0.87, 'Hamilton': 0.83, 'Ottawa': 0.88, 'Kitchener / Waterloo': 0.82 };

const BATH_TYPES = [
  { label: 'Powder Room (half-bath)', base: 7500 },
  { label: 'Standard 3-piece Bathroom', base: 14000 },
  { label: 'Full 4-piece Bathroom', base: 17500 },
  { label: 'Master En-Suite (large)', base: 26000 },
];

const FINISH_LEVELS = [
  { label: 'Budget', multiplier: 0.6, desc: 'Builder-grade tile, stock vanity, basic fixtures' },
  { label: 'Mid-Range', multiplier: 1.0, desc: 'Quality tile, semi-custom vanity, premium fixtures' },
  { label: 'Premium', multiplier: 1.55, desc: 'Large-format tile, custom vanity, frameless glass, heated floors' },
];

export default function BathroomRenovationCalculatorPage() {
  const [bathTypeIdx, setBathTypeIdx] = useState(1);
  const [finishIdx, setFinishIdx] = useState(1);
  const [cityKey, setCityKey] = useState('Durham Region (Oshawa/Whitby)');
  const [heatedFloors, setHeatedFloors] = useState(false);
  const [customGlass, setCustomGlass] = useState(false);

  const selectedBathType = BATH_TYPES[bathTypeIdx] ?? BATH_TYPES[1]!;
  const selectedFinish = FINISH_LEVELS[finishIdx] ?? FINISH_LEVELS[1]!;
  const cityMultiplier = CITY_MULT[cityKey] ?? 1;
  const base = selectedBathType.base * selectedFinish.multiplier * cityMultiplier;
  const extras = (heatedFloors ? 1800 : 0) + (customGlass ? 2500 : 0);
  const low = Math.round((base + extras) * 0.82 / 250) * 250;
  const high = Math.round((base + extras) * 1.22 / 250) * 250;
  const mid = Math.round((low + high) / 2 / 250) * 250;
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
            <span className="text-gray-900 font-medium">Bathroom Calculator</span>
          </nav>

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-sm mb-4">
              <Calculator className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-700">Free Bathroom Renovation Calculator</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
              Bathroom Renovation<br />Cost Calculator
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Estimate bathroom renovation costs for Ontario homes. Calibrated by city, bathroom type, and finish level.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Bathroom Type</label>
                  <div className="space-y-2">
                    {BATH_TYPES.map((b, i) => (
                      <button key={b.label} onClick={() => setBathTypeIdx(i)}
                        className={`w-full p-3 text-sm rounded-lg border text-left transition-colors ${bathTypeIdx === i ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold' : 'border-gray-200 hover:border-rose-300'}`}>{b.label}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Finish Level</label>
                  <div className="space-y-2">
                    {FINISH_LEVELS.map((f, i) => (
                      <button key={f.label} onClick={() => setFinishIdx(i)}
                        className={`w-full p-3 text-sm rounded-lg border text-left transition-colors ${finishIdx === i ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold' : 'border-gray-200 hover:border-rose-300'}`}>
                        <div className="font-semibold">{f.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{f.desc}</div>
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

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700">Add-Ons</label>
                  <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-rose-300">
                    <input type="checkbox" checked={heatedFloors} onChange={(e) => setHeatedFloors(e.target.checked)} className="mt-0.5 accent-rose-600" />
                    <div><div className="font-semibold text-sm">Heated Floor (electric)</div><div className="text-xs text-gray-500">~$1,800 installed</div></div>
                  </label>
                  <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-rose-300">
                    <input type="checkbox" checked={customGlass} onChange={(e) => setCustomGlass(e.target.checked)} className="mt-0.5 accent-rose-600" />
                    <div><div className="font-semibold text-sm">Frameless Glass Shower Enclosure</div><div className="text-xs text-gray-500">~$2,500 installed</div></div>
                  </label>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-gray-900 text-lg mb-6">Your Estimated Range</h3>
                  <div className="bg-[#800020] rounded-2xl p-6 text-white mb-4">
                    <p className="text-rose-100 text-sm mb-1">Estimated Bathroom Renovation Cost</p>
                    <p className="text-4xl font-black mb-1">{fmt(mid)}</p>
                    <p className="text-rose-200 text-sm">Range: {fmt(low)} – {fmt(high)}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-green-50 rounded-xl p-3 text-center"><p className="text-xs text-gray-500 mb-1">Budget</p><p className="font-black text-gray-900 text-sm">{fmt(low)}</p></div>
                    <div className="bg-rose-50 rounded-xl p-3 text-center border border-rose-200"><p className="text-xs text-gray-500 mb-1">Mid-Range</p><p className="font-black text-rose-700 text-sm">{fmt(mid)}</p></div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center"><p className="text-xs text-gray-500 mb-1">Premium</p><p className="font-black text-gray-900 text-sm">{fmt(high)}</p></div>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mb-4">
                    <p className="text-xs font-bold text-amber-700 mb-1">⚠️ Calculator estimate only.</p>
                    <p className="text-xs text-amber-800">Upload photos for an accurate AI estimate. Final costs depend on your specific bathroom.</p>
                  </div>
                </div>
                <Link href="/create-lead" className="bg-[#800020] text-white font-bold px-6 py-4 rounded-2xl hover:shadow-lg transition-all text-center block">
                  📸 Get Accurate AI Estimate (Free) →
                </Link>
                <p className="text-xs text-center text-gray-500 mt-2">Upload photos · Free · Takes 2 minutes</p>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="font-black text-gray-900">About Bathroom Renovation Costs in Ontario</h2>
            <p>Bathroom renovation costs in Ontario range from $6,000 (basic powder room) to $45,000+ (luxury master en-suite). The main cost drivers are bathroom type, tile quality, fixture choices, and whether heated floors or custom glass enclosures are included.</p>
            <h3>Cost Breakdown by Component</h3>
            <p><strong>Tile work</strong> (floor + surround) typically accounts for 25–35% of bathroom renovation costs. <strong>Fixtures</strong> (vanity, toilet, tub/shower, mirrors, lighting) account for 20–30%. <strong>Labour</strong> (demolition, plumbing, tiling, finishing) accounts for 40–50%.</p>
            <h3>Adding a Bathroom vs Renovating</h3>
            <p>Adding a new bathroom to a home with only one full bathroom typically costs $18,000–$40,000 in Ontario — but can return 85–110% of cost in added home value. It&apos;s one of the highest-ROI renovations in Ontario&apos;s market.</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { label: 'Bathroom Renovation Oshawa', href: '/bathroom-renovation-oshawa' },
              { label: 'Bathroom Renovation Whitby', href: '/bathroom-renovation-whitby' },
              { label: 'Bathroom Renovation Ajax', href: '/bathroom-renovation-ajax' },
              { label: 'Ontario Cost Guide', href: '/ontario-renovation-cost-guide' },
              { label: 'Kitchen Calculator', href: '/kitchen-renovation-calculator' },
              { label: 'Basement Calculator', href: '/basement-renovation-calculator' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
