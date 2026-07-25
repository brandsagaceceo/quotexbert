'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calculator, CheckCircle, Shield, Award, HelpCircle, FileText, Sparkles, ChevronDown } from 'lucide-react';
import { SeoSchema } from '@/components/SeoSchema';

const CITIES = [
  'Toronto Core',
  'Oshawa / Courtice',
  'Whitby / Brooklin',
  'Ajax / Pickering',
  'Mississauga',
  'Scarborough',
  'North York',
  'Etobicoke',
  'Hamilton',
  'Ottawa',
  'Kitchener / Waterloo'
];

const CITY_MULT: Record<string, number> = {
  'Toronto Core': 1.0,
  'Oshawa / Courtice': 0.84,
  'Whitby / Brooklin': 0.85,
  'Ajax / Pickering': 0.87,
  'Mississauga': 0.98,
  'Scarborough': 0.92,
  'North York': 0.95,
  'Etobicoke': 0.94,
  'Hamilton': 0.83,
  'Ottawa': 0.88,
  'Kitchener / Waterloo': 0.82
};

const BATH_TYPES = [
  { label: 'Powder Room (half-bath)', base: 7500, desc: '2 fixtures (sink + toilet), typical footprint of 20-30 sq ft.' },
  { label: 'Standard 3-piece Bathroom', base: 14000, desc: '3 fixtures (sink, toilet, tub/shower), typical footprint of 40-50 sq ft.' },
  { label: 'Full 4-piece Bathroom', base: 17500, desc: '4 fixtures (sink, toilet, separate shower, tub), typical footprint of 60-80 sq ft.' },
  { label: 'Master En-Suite (large)', base: 26000, desc: 'Premium oasis including double vanity, walk-in tiled shower, standalone tub.' },
];

const FINISH_LEVELS = [
  { label: 'Budget (Builder-Grade)', multiplier: 0.6, desc: 'Stock vanity, standard single-flush toilet, acrylic prefab tub/shower surround, basic vinyl/ceramic tile.' },
  { label: 'Mid-Range (Quality-Standard)', multiplier: 1.0, desc: 'Semi-custom pre-assembled vanity, porcelain floor/wall tiling, upgraded fixtures, frameless sliding glass slider, Schluter waterproofing.' },
  { label: 'Premium (Luxury-Custom)', multiplier: 1.55, desc: 'Fully custom double vanity, stone or large-format tile, Schluter-KERDI walk-in shower with frameless pivot glass, heated floors, wall-mount/luxury fixtures.' },
];

export default function BathroomRenovationCalculatorPage() {
  const [bathTypeIdx, setBathTypeIdx] = useState(1);
  const [finishIdx, setFinishIdx] = useState(1);
  const [cityKey, setCityKey] = useState('Toronto Core');
  const [heatedFloors, setHeatedFloors] = useState(false);
  const [customGlass, setCustomGlass] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const selectedBathType = BATH_TYPES[bathTypeIdx] ?? BATH_TYPES[1]!;
  const selectedFinish = FINISH_LEVELS[finishIdx] ?? FINISH_LEVELS[1]!;
  const cityMultiplier = CITY_MULT[cityKey] ?? 1;
  const base = selectedBathType.base * selectedFinish.multiplier * cityMultiplier;
  const extras = (heatedFloors ? 2200 : 0) + (customGlass ? 2500 : 0);
  const low = Math.round((base + extras) * 0.85 / 250) * 250;
  const high = Math.round((base + extras) * 1.15 / 250) * 250;
  const mid = Math.round((low + high) / 2 / 250) * 250;
  
  const estimatedPermitCost = 450;
  const estimatedMaterialBreakdown = Math.round(mid * 0.35);
  const estimatedLaborBreakdown = Math.round(mid * 0.50);
  const estimatedPlumbingWiringBreakdown = Math.round(mid * 0.15);

  const fmt = (n: number) => `$${n.toLocaleString()}`;

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const calculatorFaqs = [
    {
      q: "Does this bathroom renovation calculator align with the Ontario Building Code (OBC)?",
      a: "Yes. Our cost calculator factors in standard professional trades compliance required under the Ontario Building Code (OBC). This includes hiring licensed plumbers (OBC Part 7), licensed electricians (OESC compliant GFCIs), and installing proper structural framing, fire-stopping, mechanical exhaust venting (OBC 9.32), and waterproofing. DIY estimators often skip these steps, but certified Ontario general contractors must charge for proper code-compliant installation."
    },
    {
      q: "How accurate is this cost calculator for older houses in Toronto, Scarborough, or North York?",
      a: "For older homes in older GTA neighborhoods (built before 1970), you should expect a potential 10% to 20% variance on top of the 'high' range. Older homes commonly reveal knob-and-tube or legacy wiring that requires ESA-compliant replacement, cast-iron drain pipes that have corroded, off-level subfloor deflection, or lath-and-plaster walls that need full framing remediation. The calculator assumes a standard stable framing structure, so uploading photos to our primary matching system is highly recommended."
    },
    {
      q: "Does changing layout plumbing positions increase these cost calculations?",
      a: "Yes. If your renovation plan involves relocating the major core drainage lines—such as moving the toilet or shifting the bathtub drain from one corner to another—plan on adding an extra $2,500 to $5,000 to the estimated cost. Standard slab/joist drilling, concrete breaking (for basements), and re-routing main stack vents require severe licensed plumber labor margins."
    },
    {
      q: "Why is there such a large price difference between Budget and Premium levels?",
      a: "Material quality and the complexity of tile-setting represent the core divergence. A budget tile setup uses cheap 12x12 ceramic tiles and a basic slide-in faucet, whereas premium bathroom tile installs require setting large-format porcelain (e.g., 24x48 or custom marble slab), custom Schluter-KERDI waterproofing systems, linear drains, high-pressure thermostatic valves, and frameless heavy-tempered pivot glass enclosures."
    },
    {
      q: "What is the plumbing permit fee cost in Durham Region vs. Toronto Core?",
      a: "Plumbing and architectural permit fees vary by municipality. Toronto Core charges a minimum commercial/residential fee of roughly $198.59, plus fixture charges. Oshawa, Whitby, and Ajax charge flat rates starting around $300 to $600 for standard alterations. While permit fees are small, hiring an engineer to draft mechanical drawings can run between $1,200 and $2,500 if spatial structures change."
    },
    {
      q: "Are waterproofing systems like Schluter Kerk-Board or uncoupling floor systems accounted for?",
      a: "Yes, our calculator includes standard waterproofing allocations. The Mid-Range tier includes traditional sheet-applied waterproofing or liquid barrier systems. Meanwhile, our Luxury/Premium tier factors in a complete, premium, lifetime-warranted Schluter-KERDI or KERDI-BOARD waterproofing ensemble. You can read our detailed specialized guide: [who installs Schluter shower systems near me](app/who-installs-schluter-shower-systems-near-me/page.tsx) to learn more about tile preparation details."
    },
    {
      q: "Does a bathroom remodel add resale value to a home in Ontario?",
      a: "Yes, bathroom renovations represent one of the highest ROIs in Canadian real estate markets. Real estate audits verify that an upgraded, functional master en-suite or a newly added secondary washroom typically yields an ROI of 75% to 110% of its initial cost upon sale, accelerating the property’s days-on-market transaction speed."
    },
    {
      q: "How long does a standard bathroom renovation project take in the GTA?",
      a: "A powder room remodel takes roughly 5 to 9 working days. A standard 3-piece bathroom requires between 10 to 18 consecutive working days to allow proper dry times for drywall mud, tile thin-set adhesives, waterproof sealants, and grout curing. Large luxury master bathrooms can span 3 to 5 full weeks."
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <SeoSchema
        pageType="LocalService"
        title="Bathroom Renovation Cost Calculator Ontario | 2026 Prices"
        description="Free interactive bathroom cost calculator adjusted for Ontario municipalities. Get real-time cost estimates for Toronto, Oshawa, Whitby, Ajax, Scarborough, and Mississauga."
        breadcrumbs={[
          { name: 'Home', url: 'https://quotexbert.com/' },
          { name: 'Guides', url: 'https://quotexbert.com/guides' },
          { name: 'Bathroom Calculator', url: 'https://quotexbert.com/bathroom-renovation-calculator' }
        ]}
      />

      {/* Header Banner */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-[#1e1b21] to-[#2d0008] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(128,0,32,0.15),transparent_50%)]" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-300 mb-8">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <Link href="/guides" className="hover:text-amber-400 transition-colors">Guides</Link>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-100 font-medium">Bathroom Cost Calculator</span>
          </nav>

          <div className="max-w-4xl space-y-5">
            <span className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-rose-500/30">
              <Calculator className="w-3 h-3" /> Fully Updated for 2026 Models
            </span>
            <h1 className="text-4xl md:text-6xl font-black leading-tight">
              Ontario Bathroom Renovation <br />Cost Calculator
            </h1>
            <p className="text-xl text-slate-200 font-normal max-w-2xl leading-relaxed">
              Plan your renovation with our real-time interactive estimator. Calibrated precisely to the Ontario Building Code (OBC), regional municipal labor variations, and material tiers.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-10 mb-12">
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-8">
                {/* Select Bathroom Type */}
                <div>
                  <label className="block text-sm font-black text-slate-900 mb-3 uppercase tracking-wider">
                    Step 1: Choose Bathroom Configuration
                  </label>
                  <div className="space-y-2.5">
                    {BATH_TYPES.map((b, i) => (
                      <button
                        key={b.label}
                        onClick={() => setBathTypeIdx(i)}
                        className={`w-full p-4 text-left rounded-xl border transition-all ${
                          bathTypeIdx === i
                            ? 'border-[#800020] bg-rose-50/50 shadow-sm ring-1 ring-[#800020]'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`font-bold text-sm ${bathTypeIdx === i ? 'text-[#800020]' : 'text-slate-950'}`}>{b.label}</span>
                          <span className="text-xs text-slate-400 font-mono">Base: {fmt(b.base)}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{b.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Select Finish Level */}
                <div>
                  <label className="block text-sm font-black text-slate-900 mb-3 uppercase tracking-wider">
                    Step 2: Choose Finishes & Customization
                  </label>
                  <div className="space-y-2.5">
                    {FINISH_LEVELS.map((f, i) => (
                      <button
                        key={f.label}
                        onClick={() => setFinishIdx(i)}
                        className={`w-full p-4 text-left rounded-xl border transition-all ${
                          finishIdx === i
                            ? 'border-[#800020] bg-rose-50/50 shadow-sm ring-1 ring-[#800020]'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`font-bold text-sm ${finishIdx === i ? 'text-[#800020]' : 'text-slate-950'}`}>{f.label}</span>
                          <span className="text-xs text-slate-400 font-mono">Mult: x{f.multiplier}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{f.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Select Location */}
                <div>
                  <label className="block text-sm font-black text-slate-900 mb-3 uppercase tracking-wider">
                    Step 3: Select Your Location (GTA & Ontario)
                  </label>
                  <div className="relative">
                    <select
                      value={cityKey}
                      onChange={(e) => setCityKey(e.target.value)}
                      className="w-full p-4 border border-slate-200 rounded-xl text-base bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#800020] appearance-none cursor-pointer text-slate-950 font-bold"
                    >
                      {CITIES.map((c) => (
                        <option key={c} value={c}>{c} (Factor: {CITY_MULT[c]})</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Estimates are fine-tuned to local municipal labor rates. Toronto core has premium downtown parking/delivery margins.
                  </p>
                </div>

                {/* Technical Addons */}
                <div className="space-y-3">
                  <label className="block text-sm font-black text-slate-900 uppercase tracking-wider">
                    Step 4: Premium Optional Add-Ons
                  </label>
                  <label className="flex items-start gap-3.5 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-rose-200 hover:bg-slate-50/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={heatedFloors}
                      onChange={(e) => setHeatedFloors(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-[#800020] rounded border-slate-300"
                    />
                    <div>
                      <div className="font-bold text-sm text-slate-950">Heated Tiled Floors (Electric Underlayment)</div>
                      <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">Adds ~$2,200. Covers Schluter DITRA-HEAT membrane, floor sensor wire, and a thermostat controller panel.</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3.5 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-rose-200 hover:bg-slate-50/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={customGlass}
                      onChange={(e) => setCustomGlass(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-[#800020] rounded border-slate-300"
                    />
                    <div>
                      <div className="font-bold text-sm text-slate-950">Frameless Glass Panel Enclosure (Custom Tempered)</div>
                      <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">Adds ~$2,500. Professional glazing crew, high-quality 10mm tempered safety glass, and heavy brass pivot hardware.</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Estimate Output Column */}
              <div className="flex flex-col justify-between bg-slate-50 rounded-2xl border border-slate-200 p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="font-black text-slate-950 text-base uppercase tracking-wider mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" /> Projected Cost Summary
                  </h3>
                  
                  <div className="bg-[#800020] rounded-2xl p-6 text-white mb-6 shadow-md relative overflow-hidden">
                    <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-5">
                      <Calculator className="w-48 h-44" />
                    </div>
                    <p className="text-rose-100 text-xs font-black uppercase tracking-wider mb-1">Estimated Bathroom Cost</p>
                    <p className="text-4xl md:text-5xl font-black mb-1">{fmt(mid)}</p>
                    <p className="text-rose-200/90 text-sm font-semibold">Projected Range: {fmt(low)} – {fmt(high)}</p>
                  </div>

                  {/* Pricing Breakdown Rows */}
                  <div className="space-y-3 mb-6">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Itemized Cost Estimate (approximate)</h4>
                    <div className="border border-slate-200 bg-white rounded-xl p-4 divide-y divide-slate-100 space-y-2.5">
                      <div className="flex justify-between text-sm pt-0">
                        <span className="text-slate-600 font-medium">Finishes & Raw Materials (35%)</span>
                        <span className="font-bold text-slate-900">{fmt(estimatedMaterialBreakdown)}</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2">
                        <span className="text-slate-600 font-medium">Professional Labor & Prep (50%)</span>
                        <span className="font-bold text-slate-900">{fmt(estimatedLaborBreakdown)}</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2">
                        <span className="text-slate-600 font-medium">Licensed Plumbing & Electrical (15%)</span>
                        <span className="font-bold text-slate-900">{fmt(estimatedPlumbingWiringBreakdown)}</span>
                      </div>
                      <div className="flex justify-between text-xs pt-2 font-semibold text-rose-700">
                        <span>Municipal Building & Trade Permits</span>
                        <span>~{fmt(estimatedPermitCost)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bullet Highlights */}
                  <div className="bg-amber-50/80 rounded-xl p-4.5 border border-amber-200 space-y-2.5">
                    <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                      🛡️ Guard Against Cash-Flow Disasters
                    </p>
                    <p className="text-xs text-amber-900/90 leading-relaxed font-normal">
                      Municipal building and trade permits are non-negotiable in Ontario. Unpermitted bathroom plumbing or structural modifications can completely void your homeowner home insurance policy if a leak or fire occurs. Always require ESA-compliant Certificates from your electrician and complete pressure/flood tests.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-200">
                  <Link
                    href="/create-lead"
                    className="bg-[#800020] text-white font-bold px-6 py-4 rounded-xl hover:bg-[#990024] hover:shadow-lg transition-all text-center block text-lg"
                  >
                    📸 Upload Photos for Accurate AI Quote →
                  </Link>
                  <p className="text-xs text-center text-slate-500 font-medium">
                    Upload snaps of your current bathroom · Free AI matching · Takes 2 minutes
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Editorial Section - SEO Domination & Authority */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 mb-16 space-y-10">
            <div className="space-y-4 max-w-4xl">
              <h2 className="text-3xl md:text-4xl font-black text-slate-950">
                Understanding Bathroom Renovation Economics in Ontario
              </h2>
              <p className="text-slate-600 leading-relaxed text-base">
                In 2026, bathroom remodeling retains its status as the highest ROI project you can run inside a residential property. However, inflation, supply chains for premium plumbing fixtures (such as back-outlet wall toilets or linear shower drains), and a extreme shortage of licensed, Red Seal contractors across Ontario have pushed standard costs up.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="inline-block p-2 bg-[#800020]/10 rounded-lg text-[#800020] font-sans">
                  <Shield className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-950 text-base">Licensed Trade Labor</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Rough plumbing edits and electrical structural modifications must only be executed by Ontario certified plumbers and Master Electricians possessing ESA authorization.
                </p>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="inline-block p-2 bg-[#800020]/10 rounded-lg text-[#800020] font-sans">
                  <Award className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-950 text-base">Tile Prep & Schluter</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Waterproofing is the leading structural failure point. Insist on a complete sealed system (Schluter Kerdi/Ditra) over raw dry cement board setups to bypass leaks.
                </p>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="inline-block p-2 bg-[#800020]/10 rounded-lg text-[#800020] font-sans">
                  <FileText className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-950 text-base">Permit Management</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  If you alter plumbing stacks or knock down load-bearing studs, a building permit is legally baseline. Home insurers check public permit logs during claims.
                </p>
              </div>
            </div>

            {/* Real World Pricing Table */}
            <div className="space-y-4">
              <h3 className="font-black text-slate-950 text-xl flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#800020]" /> Estimated 2026 Price List Across Ontario regions
              </h3>
              <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-100 text-slate-900 border-b border-slate-200 font-bold">
                    <tr>
                      <th className="p-4">Bathroom Type</th>
                      <th className="p-4">Toronto Core (Premium)</th>
                      <th className="p-4">Oshawa / Whitby (Rural/Suburban)</th>
                      <th className="p-4">Ajax / Pickering (Suburban)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-4 font-bold text-slate-900">Powder Room (2-piece)</td>
                      <td className="p-4 font-mono">$7,500 – $10,500</td>
                      <td className="p-4 font-mono">$6,300 – $8,800</td>
                      <td className="p-4 font-mono">$6,500 – $9,100</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-4 font-bold text-slate-900">Standard 3-piece Bathroom</td>
                      <td className="p-4 font-mono">$13,500 – $18,000</td>
                      <td className="p-4 font-mono">$11,300 – $15,100</td>
                      <td className="p-4 font-mono">$11,700 – $15,600</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-slate-900">Full 4-piece Bathroom</td>
                      <td className="p-4 font-mono">$17,000 – $24,500</td>
                      <td className="p-4 font-mono">$14,200 – $20,500</td>
                      <td className="p-4 font-mono">$14,700 – $21,300</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-4 font-bold text-slate-900">Master En-Suite Oasis</td>
                      <td className="p-4 font-mono">$25,000 – $45,000+</td>
                      <td className="p-4 font-mono">$21,000 – $37,800+</td>
                      <td className="p-4 font-mono">$21,750 – $39,150+</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Interactive PAA FAQ Segment */}
          <section className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 mb-12">
            <h2 className="text-3xl font-black text-slate-950 mb-3 flex items-center gap-2">
              <HelpCircle className="w-7 h-7 text-[#800020]" /> Bathroom Renovation FAQ & PAA Playbook
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8 max-w-3xl">
              Get immediate answers to target People Also Ask (PAA) search blocks. Fully synchronized with local Ontario Building codes, construction logistics, and cash-flow mitigation tips.
            </p>

            <div className="space-y-4">
              {calculatorFaqs.map((faq, i) => (
                <div key={i} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full p-5 text-left font-bold text-slate-900 flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 transition-colors gap-4"
                  >
                    <span className="text-sm md:text-base">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform flex-shrink-0 ${expandedFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFaq === i && (
                    <div className="p-5 border-t border-slate-200 bg-white text-slate-700 leading-relaxed text-sm md:text-base">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Internal Connection Hub */}
          <div className="bg-slate-100/80 rounded-2xl border border-slate-200 p-8">
            <h3 className="text-lg font-black text-slate-950 mb-4 uppercase tracking-wider">
              Explore Our Comprehensive Bathroom Authority Cluster
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Oshawa Bathroom Renovation Guide', href: '/bathroom-renovation-oshawa' },
                { label: 'Whitby Bathroom Renovation Guide', href: '/bathroom-renovation-whitby' },
                { label: 'Ajax Bathroom Projects Guide', href: '/bathroom-renovation-ajax' },
                { label: 'Pickering Bathroom Projects Guide', href: '/bathroom-renovation-pickering' },
                { label: 'Toronto Bathroom Costs Guide', href: '/bathroom-renovation-cost-toronto' },
                { label: 'Waterproofing Pros: Who Installs Schluter?', href: '/who-installs-schluter-shower-systems-near-me' },
                { label: 'Is a $10k Bathroom Budget Real?', href: '/can-i-renovate-my-bathroom-for-10000-ontario' },
                { label: 'Ontario Professional Lead Dashboard', href: '/guides' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="bg-white hover:bg-slate-50 text-slate-700 hover:text-[#800020] font-semibold px-4.5 py-2.5 rounded-xl border border-slate-200 text-xs shadow-sm hover:shadow-md hover:border-[#800020]/20 transition-all"
                >
                  {link.label} &rarr;
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Extreme CTA Footer */}
      <section className="py-20 bg-gradient-to-br from-[#800020] to-[#5c0015] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="max-w-3xl mx-auto px-4 relative z-10 space-y-6">
          <h2 className="text-3xl md:text-5xl font-black">Ready to Start Your Bathroom Transformation?</h2>
          <p className="text-rose-100 text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Skip the generic guesses. Upload a picture of your current bathroom setup and receive code-compliant, bids from certified local contractors in Ontario.
          </p>
          <div className="pt-4">
            <Link
              href="/create-lead"
              className="bg-white hover:bg-rose-50 text-[#800020] font-black text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all inline-block"
            >
              Get Free Instant Estimate &rarr;
            </Link>
            <p className="text-xs text-rose-200 mt-3 font-medium">100% Free · No Payment Required · Verified Ontario Network Only</p>
          </div>
        </div>
      </section>
    </main>
  );
}
