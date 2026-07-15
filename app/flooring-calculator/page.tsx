'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calculator } from 'lucide-react';

const CITIES = ['Toronto Core', 'Durham Region', 'Ajax / Pickering', 'Hamilton', 'Ottawa', 'Kitchener / Waterloo'];
const CITY_MULT: Record<string, number> = { 'Toronto Core': 1.0, 'Durham Region': 0.84, 'Ajax / Pickering': 0.86, 'Hamilton': 0.82, 'Ottawa': 0.87, 'Kitchener / Waterloo': 0.81 };
const MATERIALS = [
  { label: 'Laminate Flooring', perSqft: 4.5, desc: 'Budget option, 15-25 year lifespan' },
  { label: 'Luxury Vinyl Plank (LVP)', perSqft: 6.5, desc: 'Most popular — waterproof, durable' },
  { label: 'Engineered Hardwood', perSqft: 10.0, desc: 'Real wood surface, more stable than solid' },
  { label: 'Solid Hardwood', perSqft: 14.5, desc: 'Premium, refinishable, highest value' },
  { label: 'Ceramic / Porcelain Tile', perSqft: 11.0, desc: 'Best for kitchens, bathrooms, entryways' },
  { label: 'Carpet', perSqft: 5.0, desc: 'Comfortable, good for bedrooms' },
];

export default function FlooringCalculatorPage() {
  const [sqft, setSqft] = useState(600);
  const [matIdx, setMatIdx] = useState(1);
  const [city, setCity] = useState('Durham Region');
  const [removal, setRemoval] = useState(true);

  const base = sqft * MATERIALS[matIdx].perSqft * CITY_MULT[city];
  const removalCost = removal ? sqft * 1.2 : 0;
  const low = Math.round((base + removalCost) * 0.88 / 100) * 100;
  const high = Math.round((base + removalCost) * 1.18 / 100) * 100;
  const mid = Math.round((low + high) / 2 / 100) * 100;
  const fmt = (n: number) => `$${n.toLocaleString()}`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-rose-600">Home</Link><ArrowRight className="w-4 h-4" />
            <Link href="/guides" className="hover:text-rose-600">Guides</Link><ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Flooring Calculator</span>
          </nav>

          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">Flooring Cost Calculator</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Calculate flooring installation costs for any Ontario home. All materials, all cities.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Area (sq ft)</label>
                  <input type="range" min={100} max={3000} step={50} value={sqft} onChange={(e) => setSqft(Number(e.target.value))} className="w-full accent-rose-600" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1"><span>100 sq ft</span><span className="font-bold text-rose-700">{sqft.toLocaleString()} sq ft</span><span>3,000 sq ft</span></div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Flooring Material</label>
                  <div className="space-y-2">
                    {MATERIALS.map((m, i) => (
                      <button key={m.label} onClick={() => setMatIdx(i)}
                        className={`w-full p-3 text-sm rounded-lg border text-left ${matIdx === i ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold' : 'border-gray-200 hover:border-rose-300'}`}>
                        <span className="font-semibold">{m.label}</span><span className="text-xs text-gray-500 ml-2">{m.desc}</span>
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

                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-rose-300">
                  <input type="checkbox" checked={removal} onChange={(e) => setRemoval(e.target.checked)} className="mt-0.5 accent-rose-600" />
                  <div><div className="font-semibold text-sm">Include Old Flooring Removal</div><div className="text-xs text-gray-500">~$1.20/sq ft for removal and disposal</div></div>
                </label>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-gray-900 text-lg mb-6">Estimated Cost</h3>
                  <div className="bg-gradient-to-br from-rose-600 to-orange-600 rounded-2xl p-6 text-white mb-4">
                    <p className="text-rose-100 text-sm mb-1">Flooring Installation Cost</p>
                    <p className="text-4xl font-black mb-1">{fmt(mid)}</p>
                    <p className="text-rose-200 text-sm">Range: {fmt(low)} – {fmt(high)}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-4">
                    <p className="text-xs font-bold text-blue-800 mb-1">📊 Per Square Foot Breakdown</p>
                    <p className="text-xs text-blue-700">Material: ${MATERIALS[matIdx].perSqft.toFixed(2)}/sq ft · Labour: ~$2.50–$4.00/sq ft · Total: ~${(MATERIALS[matIdx].perSqft + 3.25).toFixed(2)}/sq ft installed</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <Link href="/create-lead" className="bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold px-6 py-4 rounded-2xl hover:shadow-lg transition-all text-center block">📸 Get Accurate AI Estimate →</Link>
                  <Link href="/flooring-ajax" className="border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl text-center block text-sm hover:border-rose-300 hover:text-rose-600 transition-colors">Flooring Guide: Ajax →</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="font-black text-gray-900">Ontario Flooring Installation Costs</h2>
            <p>Flooring installation costs in Ontario range from $3.00–$18.00 per square foot installed (material + labour). Luxury vinyl plank (LVP) is the most popular choice in Ontario homes — it&apos;s waterproof, durable, comfortable, and costs $5.50–$8.00/sq ft installed. Solid hardwood is the premium choice at $12–$18/sq ft but adds the most long-term value and can be refinished multiple times.</p>
            <h3>Labour vs Material Split</h3>
            <p>On average, labour accounts for 35–45% of flooring installation costs in Ontario. Complex patterns (herringbone, chevron), staple-down hardwood, and large-format tile all require more labour and increase costs. Floating floor systems (LVP, laminate, engineered hardwood) are faster to install and lower cost in labour.</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {[{ label: 'Flooring Ajax', href: '/flooring-ajax' }, { label: 'Ontario Cost Guide', href: '/ontario-renovation-cost-guide' }, { label: 'Kitchen Calculator', href: '/kitchen-renovation-calculator' }, { label: 'All Guides', href: '/guides' }].map((link) => (
              <Link key={link.href} href={link.href} className="bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
