'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const CITIES = ['Toronto Core', 'Durham Region', 'Ajax / Pickering', 'Hamilton', 'Ottawa', 'Kitchener / Waterloo'];
const CITY_MULT: Record<string, number> = { 'Toronto Core': 1.0, 'Durham Region': 0.84, 'Ajax / Pickering': 0.86, 'Hamilton': 0.82, 'Ottawa': 0.87, 'Kitchener / Waterloo': 0.81 };
const HOME_SIZES = [
  { label: 'Small (< 1,200 sq ft)', sqft: 1000 },
  { label: 'Average (1,200–1,800 sq ft)', sqft: 1500 },
  { label: 'Large (1,800–2,500 sq ft)', sqft: 2100 },
  { label: 'Extra Large (2,500+ sq ft)', sqft: 3000 },
];
const SHINGLE_TYPES = [
  { label: '3-Tab Asphalt (20-yr)', perSqft: 5.0 },
  { label: 'Architectural Shingles (30-yr)', perSqft: 7.0 },
  { label: 'Metal Roofing (50+ yr)', perSqft: 12.0 },
];

export default function RoofReplacementCalculatorPage() {
  const [sizeIdx, setSizeIdx] = useState(1);
  const [shingleIdx, setShingleIdx] = useState(1);
  const [city, setCity] = useState('Durham Region');
  const [gutters, setGutters] = useState(false);

  const selectedSize = HOME_SIZES[sizeIdx] ?? HOME_SIZES[1]!;
  const selectedShingle = SHINGLE_TYPES[shingleIdx] ?? SHINGLE_TYPES[1]!;
  const cityMultiplier = CITY_MULT[city] ?? 1;
  const sqft = selectedSize.sqft;
  const roofSqft = sqft * 1.2;
  const base = roofSqft * selectedShingle.perSqft * cityMultiplier;
  const gutterCost = gutters ? 2000 * cityMultiplier : 0;
  const low = Math.round((base + gutterCost) * 0.88 / 500) * 500;
  const high = Math.round((base + gutterCost) * 1.18 / 500) * 500;
  const mid = Math.round((low + high) / 2 / 500) * 500;
  const fmt = (n: number) => `$${n.toLocaleString()}`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-rose-600">Home</Link><ArrowRight className="w-4 h-4" />
            <Link href="/guides" className="hover:text-rose-600">Guides</Link><ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Roof Calculator</span>
          </nav>
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">Roof Replacement Cost Calculator</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Estimate roof replacement costs for Ontario homes — asphalt, architectural, and metal roofing options.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Home Size</label>
                  <div className="space-y-2">
                    {HOME_SIZES.map((s, i) => (
                      <button key={s.label} onClick={() => setSizeIdx(i)} className={`w-full p-3 text-sm rounded-lg border text-left ${sizeIdx === i ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold' : 'border-gray-200 hover:border-rose-300'}`}>{s.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Shingle Type</label>
                  <div className="space-y-2">
                    {SHINGLE_TYPES.map((s, i) => (
                      <button key={s.label} onClick={() => setShingleIdx(i)} className={`w-full p-3 text-sm rounded-lg border text-left ${shingleIdx === i ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold' : 'border-gray-200 hover:border-rose-300'}`}>{s.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                  <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg text-sm">{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
                </div>
                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-rose-300">
                  <input type="checkbox" checked={gutters} onChange={(e) => setGutters(e.target.checked)} className="mt-0.5 accent-rose-600" />
                  <div><div className="font-semibold text-sm">Replace Eavestroughs (Gutters)</div><div className="text-xs text-gray-500">Full eavestrough replacement — adds ~$2,000</div></div>
                </label>
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-gray-900 text-lg mb-6">Estimated Cost</h3>
                  <div className="bg-[#800020] rounded-2xl p-6 text-white mb-4">
                    <p className="text-rose-100 text-sm mb-1">Roof Replacement Cost</p>
                    <p className="text-4xl font-black mb-1">{fmt(mid)}</p>
                    <p className="text-rose-200 text-sm">Range: {fmt(low)} – {fmt(high)}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-4">
                    <p className="text-xs font-bold text-blue-800 mb-1">📊 Roof Area Estimate</p>
                    <p className="text-xs text-blue-700">Estimated roof area: ~{Math.round(roofSqft)} sq ft (home area × 1.2 factor for pitch)</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <Link href="/create-lead" className="bg-[#800020] text-white font-bold px-6 py-4 rounded-2xl hover:shadow-lg transition-all text-center block">📸 Get Accurate AI Estimate →</Link>
                  <Link href="/roof-replacement-pickering" className="border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl text-center block text-sm hover:border-rose-300 hover:text-rose-600 transition-colors">Roofing Guide: Pickering →</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="prose prose-lg max-w-none text-gray-700 bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="font-black text-gray-900">Ontario Roof Replacement Costs</h2>
            <p>Roof replacement in Ontario costs $7,000–$35,000 depending on home size, shingle type, and location. Architectural shingles (30-year lifespan) are the most popular choice — they cost $1,500–$3,000 more than basic 3-tab shingles but offer better wind resistance and aesthetics. Metal roofing is the premium option with 50+ year lifespan and best performance in Ontario&apos;s freeze-thaw climate.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {[{ label: 'Roof Replacement Pickering', href: '/roof-replacement-pickering' }, { label: 'Ontario Cost Guide', href: '/ontario-renovation-cost-guide' }, { label: 'All Guides', href: '/guides' }].map((link) => (
              <Link key={link.href} href={link.href} className="bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
