'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const CITIES = ['Toronto Core', 'Durham Region', 'Ajax / Pickering', 'Hamilton', 'Ottawa', 'Kitchener / Waterloo'];
const CITY_MULT: Record<string, number> = { 'Toronto Core': 1.0, 'Durham Region': 0.84, 'Ajax / Pickering': 0.86, 'Hamilton': 0.82, 'Ottawa': 0.87, 'Kitchener / Waterloo': 0.81 };
const WIN_TYPES = [
  { label: 'Standard Casement / Double-Hung', perUnit: 680 },
  { label: 'Bay or Bow Window', perUnit: 2200 },
  { label: 'Fixed Picture Window', perUnit: 750 },
  { label: 'Sliding Patio Door', perUnit: 1800 },
];
const FRAME_TYPES = [
  { label: 'Vinyl (budget-friendly)', multiplier: 1.0, desc: 'Most common, good energy efficiency' },
  { label: 'Fibreglass (premium)', multiplier: 1.45, desc: 'Best insulation, most durable' },
  { label: 'Triple-Pane (energy upgrade)', multiplier: 1.7, desc: 'Best for cold Ontario winters' },
];

export default function WindowReplacementCalculatorPage() {
  const [count, setCount] = useState(8);
  const [winTypeIdx, setWinTypeIdx] = useState(0);
  const [frameIdx, setFrameIdx] = useState(0);
  const [city, setCity] = useState('Durham Region');

  const selectedWindowType = WIN_TYPES[winTypeIdx] ?? WIN_TYPES[0]!;
  const selectedFrameType = FRAME_TYPES[frameIdx] ?? FRAME_TYPES[0]!;
  const cityMultiplier = CITY_MULT[city] ?? 1;
  const base = count * selectedWindowType.perUnit * selectedFrameType.multiplier * cityMultiplier;
  const low = Math.round(base * 0.85 / 200) * 200;
  const high = Math.round(base * 1.22 / 200) * 200;
  const mid = Math.round((low + high) / 2 / 200) * 200;
  const fmt = (n: number) => `$${n.toLocaleString()}`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-rose-600">Home</Link><ArrowRight className="w-4 h-4" />
            <Link href="/guides" className="hover:text-rose-600">Guides</Link><ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Window Calculator</span>
          </nav>
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">Window Replacement Cost Calculator</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Estimate window replacement costs for Ontario homes — all window types and frame materials.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Number of Windows</label>
                  <input type="range" min={1} max={25} step={1} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full accent-rose-600" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1"><span>1</span><span className="font-bold text-rose-700">{count} windows</span><span>25</span></div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Window Type</label>
                  <div className="space-y-2">
                    {WIN_TYPES.map((w, i) => (
                      <button key={w.label} onClick={() => setWinTypeIdx(i)} className={`w-full p-3 text-sm rounded-lg border text-left ${winTypeIdx === i ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold' : 'border-gray-200 hover:border-rose-300'}`}>{w.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Frame Material</label>
                  <div className="space-y-2">
                    {FRAME_TYPES.map((f, i) => (
                      <button key={f.label} onClick={() => setFrameIdx(i)} className={`w-full p-3 text-sm rounded-lg border text-left ${frameIdx === i ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold' : 'border-gray-200 hover:border-rose-300'}`}>
                        <span className="font-semibold">{f.label}</span><span className="text-xs text-gray-500 ml-2">{f.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                  <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg text-sm">{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-gray-900 text-lg mb-6">Estimated Cost</h3>
                  <div className="bg-[#800020] rounded-2xl p-6 text-white mb-4">
                    <p className="text-rose-100 text-sm mb-1">Window Replacement Cost</p>
                    <p className="text-4xl font-black mb-1">{fmt(mid)}</p>
                    <p className="text-rose-200 text-sm">Range: {fmt(low)} – {fmt(high)}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200 mb-4">
                    <p className="text-xs font-bold text-green-800 mb-1">💡 Greener Homes Grant</p>
                    <p className="text-xs text-green-700">Check eligibility for Canada Greener Homes Grant — up to $5,600 for qualifying window upgrades. nrcan.gc.ca</p>
                  </div>
                </div>
                <Link href="/create-lead" className="bg-[#800020] text-white font-bold px-6 py-4 rounded-2xl hover:shadow-lg transition-all text-center block">📸 Get Accurate AI Estimate →</Link>
              </div>
            </div>
          </div>
          <div className="prose prose-lg max-w-none text-gray-700 bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="font-black text-gray-900">Ontario Window Replacement Costs</h2>
            <p>Window replacement in Ontario costs $450–$2,000+ per window installed, depending on window type and frame material. Most Ontario homeowners replacing a full set of standard windows (8–12 windows) spend $5,000–$15,000. Triple-pane windows are particularly valuable in Ontario&apos;s cold climate — they can reduce heating costs by 15–25%.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {[{ label: 'Ontario Cost Guide', href: '/ontario-renovation-cost-guide' }, { label: 'All Guides', href: '/guides' }, { label: 'Get Free AI Estimate', href: '/create-lead' }].map((link) => (
              <Link key={link.href} href={link.href} className="bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
