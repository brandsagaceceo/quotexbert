'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calculator } from 'lucide-react';

// Note: Metadata cannot be exported from client components.
// SEO is handled via parent layout and this page's static content.

const CITIES = ['Toronto Core', 'Durham Region (Oshawa/Whitby)', 'Ajax / Pickering', 'Hamilton', 'Ottawa', 'Kitchener / Waterloo'];
const CITY_MULTIPLIERS: Record<string, number> = {
  'Toronto Core': 1.0,
  'Durham Region (Oshawa/Whitby)': 0.85,
  'Ajax / Pickering': 0.87,
  'Hamilton': 0.83,
  'Ottawa': 0.88,
  'Kitchener / Waterloo': 0.82,
};

const SIZE_PRESETS = [
  { label: 'Small Kitchen (< 100 sq ft)', sqft: 80 },
  { label: 'Average Kitchen (100–150 sq ft)', sqft: 125 },
  { label: 'Large Kitchen (150–200 sq ft)', sqft: 175 },
  { label: 'Open-Concept / Island Kitchen (200+ sq ft)', sqft: 225 },
];

const FINISH_LEVELS = [
  { label: 'Budget Refresh', multiplier: 0.6, desc: 'Stock cabinets, laminate counters, LVP flooring' },
  { label: 'Mid-Range (Most Popular)', multiplier: 1.0, desc: 'Semi-custom cabinets, quartz counters, LVP flooring' },
  { label: 'Premium', multiplier: 1.6, desc: 'Custom cabinets, premium counters, engineered hardwood' },
];

const BASE_COST_PER_SQFT = 250; // mid-range baseline

export default function KitchenRenovationCalculatorPage() {
  const [sqft, setSqft] = useState(125);
  const [finishIdx, setFinishIdx] = useState(1);
  const [cityKey, setCityKey] = useState('Durham Region (Oshawa/Whitby)');
  const [layoutChange, setLayoutChange] = useState(false);
  const [applianceUpgrade, setApplianceUpgrade] = useState(false);

  const selectedFinish = FINISH_LEVELS[finishIdx] ?? FINISH_LEVELS[1]!;
  const cityMultiplier = CITY_MULTIPLIERS[cityKey] ?? 1;
  const base = BASE_COST_PER_SQFT * sqft * selectedFinish.multiplier * cityMultiplier;
  const extras = (layoutChange ? 8000 : 0) + (applianceUpgrade ? 5000 : 0);
  const low = Math.round((base + extras) * 0.85 / 500) * 500;
  const high = Math.round((base + extras) * 1.2 / 500) * 500;
  const mid = Math.round((low + high) / 2 / 500) * 500;

  const formatCAD = (n: number) => `$${n.toLocaleString()}`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-rose-600">Home</Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/guides" className="hover:text-rose-600">Guides</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Kitchen Calculator</span>
          </nav>

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-sm mb-4">
              <Calculator className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-700">Free Kitchen Renovation Calculator</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
              Kitchen Renovation<br />Cost Calculator
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Estimate your kitchen renovation cost instantly. Calibrated to Ontario city market rates.
              Then get a free AI estimate with photos for maximum accuracy.
            </p>
          </div>

          {/* Calculator */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Inputs */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Kitchen Size</label>
                  <div className="grid grid-cols-2 gap-2">
                    {SIZE_PRESETS.map((p) => (
                      <button
                        key={p.sqft}
                        onClick={() => setSqft(p.sqft)}
                        className={`p-3 text-sm rounded-lg border text-left transition-colors ${sqft === p.sqft ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold' : 'border-gray-200 hover:border-rose-300'}`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Finish Level</label>
                  <div className="space-y-2">
                    {FINISH_LEVELS.map((f, i) => (
                      <button
                        key={f.label}
                        onClick={() => setFinishIdx(i)}
                        className={`w-full p-3 text-sm rounded-lg border text-left transition-colors ${finishIdx === i ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold' : 'border-gray-200 hover:border-rose-300'}`}
                      >
                        <div className="font-semibold">{f.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{f.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your City</label>
                  <select
                    value={cityKey}
                    onChange={(e) => setCityKey(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-rose-400 focus:outline-none"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700">Additional Options</label>
                  <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-rose-300">
                    <input type="checkbox" checked={layoutChange} onChange={(e) => setLayoutChange(e.target.checked)} className="mt-0.5 accent-rose-600" />
                    <div>
                      <div className="font-semibold text-sm">Layout Change (remove wall / add island)</div>
                      <div className="text-xs text-gray-500">Adds ~$8,000 for structural/plumbing changes</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-rose-300">
                    <input type="checkbox" checked={applianceUpgrade} onChange={(e) => setApplianceUpgrade(e.target.checked)} className="mt-0.5 accent-rose-600" />
                    <div>
                      <div className="font-semibold text-sm">Full Appliance Package</div>
                      <div className="text-xs text-gray-500">Fridge, range, dishwasher, microwave — mid-range package ~$5,000</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Results */}
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-gray-900 text-lg mb-6">Your Estimated Range</h3>

                  <div className="bg-[#800020] rounded-2xl p-6 text-white mb-4">
                    <p className="text-rose-100 text-sm mb-1">Estimated Kitchen Renovation Cost</p>
                    <p className="text-4xl font-black mb-1">{formatCAD(mid)}</p>
                    <p className="text-rose-200 text-sm">Range: {formatCAD(low)} – {formatCAD(high)}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-green-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-gray-500 mb-1">Budget</p>
                      <p className="font-black text-gray-900 text-sm">{formatCAD(low)}</p>
                    </div>
                    <div className="bg-rose-50 rounded-xl p-3 text-center border border-rose-200">
                      <p className="text-xs text-gray-500 mb-1">Mid-Range</p>
                      <p className="font-black text-rose-700 text-sm">{formatCAD(mid)}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-gray-500 mb-1">Premium</p>
                      <p className="font-black text-gray-900 text-sm">{formatCAD(high)}</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mb-4">
                    <p className="text-xs font-bold text-amber-700 mb-1">⚠️ This is an estimate, not a quote.</p>
                    <p className="text-xs text-amber-800">Upload photos for a more accurate AI estimate. Final contractor quotes may vary based on your specific kitchen conditions.</p>
                  </div>
                </div>

                <Link
                  href="/create-lead"
                  className="bg-[#800020] text-white font-bold px-6 py-4 rounded-2xl hover:shadow-lg transition-all text-center block"
                >
                  📸 Get Accurate AI Estimate (Free) →
                </Link>
                <p className="text-xs text-center text-gray-500 mt-2">Upload photos for maximum accuracy. Free for homeowners.</p>
              </div>
            </div>
          </div>

          {/* Educational Content (Crawlable) */}
          <div className="prose prose-lg max-w-none text-gray-700 bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="font-black text-gray-900">About Kitchen Renovation Costs in Ontario</h2>
            <p>
              Kitchen renovation costs in Ontario vary significantly based on four main factors: <strong>kitchen size</strong>, <strong>finish level</strong>, <strong>city location</strong>, and <strong>whether structural changes are required</strong>. This calculator estimates costs using real market data from Ontario renovation projects.
            </p>
            <h3>Why Costs Differ by City</h3>
            <p>
              Toronto core kitchen renovations cost significantly more than the same project in Durham Region, Hamilton, or Ottawa. The difference is primarily in labour rates — a kitchen contractor in Oshawa charges 15% less than the same skill level in downtown Toronto, simply because their business overhead is lower.
            </p>
            <h3>What Drives Kitchen Renovation Costs Most</h3>
            <p>
              <strong>Cabinets</strong> account for 30–40% of total kitchen renovation costs. Choosing semi-custom vs. custom cabinetry can change total costs by $8,000–$15,000. <strong>Layout changes</strong> (removing walls, adding islands) add $5,000–$15,000 to any kitchen project. <strong>Countertops</strong> account for 10–15% of costs.
            </p>
            <h3>Getting an Accurate Quote</h3>
            <p>
              Use this calculator for initial budget planning. For an accurate estimate, upload photos of your current kitchen on QuoteXbert and describe your project — our AI analyses your specific space and generates a calibrated estimate within minutes. Then compare with 2–3 verified contractor quotes.
            </p>
          </div>

          {/* Internal Links */}
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { label: 'Kitchen Renovation Oshawa', href: '/kitchen-renovation-oshawa' },
              { label: 'Kitchen Renovation Whitby', href: '/kitchen-renovation-whitby' },
              { label: 'Kitchen Renovation Ajax', href: '/kitchen-renovation-ajax' },
              { label: 'Ontario Cost Guide', href: '/ontario-renovation-cost-guide' },
              { label: 'Bathroom Calculator', href: '/bathroom-renovation-calculator' },
              { label: 'All Calculators', href: '/guides' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
