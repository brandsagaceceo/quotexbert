'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calculator } from 'lucide-react';

const CITIES = ['Toronto Core', 'Durham Region', 'Ajax / Pickering', 'Hamilton', 'Ottawa', 'Kitchener / Waterloo'];
const CITY_MULT: Record<string, number> = { 'Toronto Core': 1.0, 'Durham Region': 0.85, 'Ajax / Pickering': 0.86, 'Hamilton': 0.82, 'Ottawa': 0.87, 'Kitchener / Waterloo': 0.81 };

const SCOPE = [
  { label: 'Single Room', sqft: 200, desc: 'Bedroom, living room, or kitchen' },
  { label: 'Small Home (< 1,200 sq ft)', sqft: 900, desc: 'Condo or bungalow' },
  { label: 'Average Home (1,200–1,800 sq ft)', sqft: 1400, desc: 'Most common in Ontario' },
  { label: 'Large Home (1,800+ sq ft)', sqft: 2100, desc: 'Two-storey or larger' },
];
const BASE_PER_SQFT_INT = 3.8;

export default function PaintingCalculatorPage() {
  const [scopeIdx, setScopeIdx] = useState(2);
  const [city, setCity] = useState('Durham Region');
  const [exterior, setExterior] = useState(false);
  const [cabinets, setCabinets] = useState(false);

  const selectedScope = SCOPE[scopeIdx] ?? SCOPE[2]!;
  const cityMultiplier = CITY_MULT[city] ?? 1;
  const sqft = selectedScope.sqft;
  const base = sqft * BASE_PER_SQFT_INT * cityMultiplier;
  const extCost = exterior ? sqft * 2.5 * cityMultiplier : 0;
  const cabCost = cabinets ? 2200 * cityMultiplier : 0;
  const low = Math.round((base + extCost + cabCost) * 0.82 / 200) * 200;
  const high = Math.round((base + extCost + cabCost) * 1.25 / 200) * 200;
  const mid = Math.round((low + high) / 2 / 200) * 200;
  const fmt = (n: number) => `$${n.toLocaleString()}`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-rose-600">Home</Link><ArrowRight className="w-4 h-4" />
            <Link href="/guides" className="hover:text-rose-600">Guides</Link><ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Painting Calculator</span>
          </nav>
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">Painting Cost Calculator</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Estimate interior and exterior painting costs for Ontario homes — by room or full home.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Painting Scope</label>
                  <div className="space-y-2">
                    {SCOPE.map((s, i) => (
                      <button key={s.label} onClick={() => setScopeIdx(i)}
                        className={`w-full p-3 text-sm rounded-lg border text-left ${scopeIdx === i ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold' : 'border-gray-200 hover:border-rose-300'}`}>
                        <span className="font-semibold">{s.label}</span><span className="text-xs text-gray-500 ml-2">{s.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                  <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg text-base">
                    {CITIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-rose-300">
                    <input type="checkbox" checked={exterior} onChange={(e) => setExterior(e.target.checked)} className="mt-0.5 accent-rose-600" />
                    <div><div className="font-semibold text-sm">Add Exterior Painting</div><div className="text-xs text-gray-500">Siding, trim, doors, eaves</div></div>
                  </label>
                  <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-rose-300">
                    <input type="checkbox" checked={cabinets} onChange={(e) => setCabinets(e.target.checked)} className="mt-0.5 accent-rose-600" />
                    <div><div className="font-semibold text-sm">Add Cabinet Painting</div><div className="text-xs text-gray-500">Kitchen or bathroom cabinet refinishing</div></div>
                  </label>
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-gray-900 text-lg mb-6">Estimated Cost</h3>
                  <div className="bg-[#800020] rounded-2xl p-6 text-white mb-4">
                    <p className="text-rose-100 text-sm mb-1">Painting Cost Estimate</p>
                    <p className="text-4xl font-black mb-1">{fmt(mid)}</p>
                    <p className="text-rose-200 text-sm">Range: {fmt(low)} – {fmt(high)}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200 mb-4">
                    <p className="text-xs font-bold text-green-800 mb-1">💡 Highest ROI Renovation</p>
                    <p className="text-xs text-green-700">Fresh neutral paint consistently delivers 80–120% ROI — the best dollar-for-dollar renovation, especially before selling.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <Link href="/create-lead" className="bg-[#800020] text-white font-bold px-6 py-4 rounded-2xl hover:shadow-lg transition-all text-center block">📸 Get Accurate AI Estimate →</Link>
                  <Link href="/painting-bowmanville" className="border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl text-center block text-sm hover:border-rose-300 hover:text-rose-600 transition-colors">Painting Guide: Bowmanville →</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="font-black text-gray-900">Ontario Painting Costs</h2>
            <p>Interior painting in Ontario costs $2.50–$5.50 per square foot (floor area) for a full home — including walls, ceilings, doors, and trim. A 1,400 sq ft home typically runs $3,500–$7,000. Exterior painting adds $2.50–$4.50 per sq ft for siding and trim. Cabinet painting is a cost-effective alternative to cabinet replacement — $1,200–$3,500 transforms the look for a fraction of new cabinet cost.</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {[{ label: 'Painting Bowmanville', href: '/painting-bowmanville' }, { label: 'Ontario Cost Guide', href: '/ontario-renovation-cost-guide' }, { label: 'All Guides', href: '/guides' }].map((link) => (
              <Link key={link.href} href={link.href} className="bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
