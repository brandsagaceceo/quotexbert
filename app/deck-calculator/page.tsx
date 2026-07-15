'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const CITIES = ['Toronto Core', 'Durham Region', 'Ajax / Pickering', 'Hamilton', 'Ottawa', 'Kitchener / Waterloo'];
const CITY_MULT: Record<string, number> = { 'Toronto Core': 1.0, 'Durham Region': 0.84, 'Ajax / Pickering': 0.86, 'Hamilton': 0.82, 'Ottawa': 0.87, 'Kitchener / Waterloo': 0.81 };
const DECK_SIZES = [
  { label: 'Small (10×12 ft = 120 sq ft)', sqft: 120 },
  { label: 'Standard (12×16 ft = 192 sq ft)', sqft: 192 },
  { label: 'Large (16×20 ft = 320 sq ft)', sqft: 320 },
  { label: 'Extra Large (400+ sq ft)', sqft: 420 },
];
const MATERIALS = [
  { label: 'Pressure-Treated Wood', perSqft: 55, desc: 'Most affordable, requires maintenance' },
  { label: 'Cedar Decking', perSqft: 80, desc: 'Natural beauty, good rot resistance' },
  { label: 'Composite Decking', perSqft: 105, desc: 'Low maintenance, premium look, 25+ year lifespan' },
];

export default function DeckCalculatorPage() {
  const [sizeIdx, setSizeIdx] = useState(1);
  const [matIdx, setMatIdx] = useState(0);
  const [city, setCity] = useState('Durham Region');
  const [pergola, setPergola] = useState(false);
  const [stairs, setStairs] = useState(true);

  const sqft = DECK_SIZES[sizeIdx].sqft;
  const base = sqft * MATERIALS[matIdx].perSqft * CITY_MULT[city];
  const extras = (pergola ? 4500 * CITY_MULT[city] : 0) + (stairs ? 1200 : 0);
  const low = Math.round((base + extras) * 0.85 / 500) * 500;
  const high = Math.round((base + extras) * 1.2 / 500) * 500;
  const mid = Math.round((low + high) / 2 / 500) * 500;
  const fmt = (n: number) => `$${n.toLocaleString()}`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-rose-600">Home</Link><ArrowRight className="w-4 h-4" />
            <Link href="/guides" className="hover:text-rose-600">Guides</Link><ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Deck Calculator</span>
          </nav>
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">Deck Building Cost Calculator</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Estimate deck construction costs for Ontario homes — wood, cedar, and composite options.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Deck Size</label>
                  <div className="space-y-2">
                    {DECK_SIZES.map((s, i) => (
                      <button key={s.label} onClick={() => setSizeIdx(i)} className={`w-full p-3 text-sm rounded-lg border text-left ${sizeIdx === i ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold' : 'border-gray-200 hover:border-rose-300'}`}>{s.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Material</label>
                  <div className="space-y-2">
                    {MATERIALS.map((m, i) => (
                      <button key={m.label} onClick={() => setMatIdx(i)} className={`w-full p-3 text-sm rounded-lg border text-left ${matIdx === i ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold' : 'border-gray-200 hover:border-rose-300'}`}>
                        <span className="font-semibold">{m.label}</span><span className="text-xs text-gray-500 ml-2">{m.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                  <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg text-sm">{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
                </div>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-rose-300">
                    <input type="checkbox" checked={stairs} onChange={(e) => setStairs(e.target.checked)} className="mt-0.5 accent-rose-600" />
                    <div><div className="font-semibold text-sm">Include Deck Stairs</div><div className="text-xs text-gray-500">Standard staircase — adds ~$1,200</div></div>
                  </label>
                  <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-rose-300">
                    <input type="checkbox" checked={pergola} onChange={(e) => setPergola(e.target.checked)} className="mt-0.5 accent-rose-600" />
                    <div><div className="font-semibold text-sm">Add Pergola / Shade Structure</div><div className="text-xs text-gray-500">Adds ~$4,500</div></div>
                  </label>
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-gray-900 text-lg mb-6">Estimated Cost</h3>
                  <div className="bg-[#800020] rounded-2xl p-6 text-white mb-4">
                    <p className="text-rose-100 text-sm mb-1">Deck Construction Cost</p>
                    <p className="text-4xl font-black mb-1">{fmt(mid)}</p>
                    <p className="text-rose-200 text-sm">Range: {fmt(low)} – {fmt(high)}</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mb-4">
                    <p className="text-xs font-bold text-amber-700 mb-1">📋 Permit Required</p>
                    <p className="text-xs text-amber-800">Decks attached to the house or over 24" high need a permit in Ontario. Add $200–$600 to your budget.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <Link href="/create-lead" className="bg-[#800020] text-white font-bold px-6 py-4 rounded-2xl hover:shadow-lg transition-all text-center block">📸 Get Accurate AI Estimate →</Link>
                  <Link href="/deck-builders-whitby" className="border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl text-center block text-sm hover:border-rose-300 hover:text-rose-600 transition-colors">Deck Builder Guide: Whitby →</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="prose prose-lg max-w-none text-gray-700 bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="font-black text-gray-900">Ontario Deck Building Costs</h2>
            <p>Deck construction costs in Ontario range from $7,000 (small pressure-treated deck) to $50,000+ (large multi-level composite deck with pergola). Composite decking costs 40–60% more than pressure-treated upfront but requires no staining or sealing — lower 10-year lifecycle cost. Cedar is the best of both worlds — natural beauty with good rot resistance, mid-range cost.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {[{ label: 'Deck Builders Whitby', href: '/deck-builders-whitby' }, { label: 'Ontario Cost Guide', href: '/ontario-renovation-cost-guide' }, { label: 'All Guides', href: '/guides' }].map((link) => (
              <Link key={link.href} href={link.href} className="bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
