import Link from "next/link";
import { ArrowRight, CheckCircle, Clock, TrendingUp, AlertTriangle, Sparkles } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Basement Renovation Cost Toronto 2026 | QuoteXbert Guide",
  description: "Complete basement renovation cost guide for Toronto & GTA. Average finishing costs, timeline, permit requirements, and expert tips. Get instant AI estimate.",
  keywords: "basement renovation cost Toronto, basement finishing price GTA, Toronto basement renovation",
};

export default function BasementRenovationCostPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-rose-600 to-orange-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="inline-block mb-6 text-sm hover:underline opacity-90">
            ← Back to QuoteXbert
          </Link>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Basement Renovation Cost in Toronto
          </h1>
          <p className="text-xl opacity-90">
            Complete 2026 pricing guide for Toronto & GTA homeowners
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Average Cost Overview */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-8 border-2 border-blue-200">
            <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-7 h-7 text-blue-600" />
              Average Basement Renovation Cost
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <p className="text-sm font-semibold text-slate-600 mb-2">Basic Finishing</p>
                <p className="text-3xl font-black text-blue-600">$25K - $40K</p>
                <p className="text-xs text-slate-500 mt-2">Open space, basic finishes (600-800 sq ft)</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md border-2 border-rose-400">
                <p className="text-sm font-semibold text-slate-600 mb-2">Mid-Range Remodel</p>
                <p className="text-3xl font-black text-rose-600">$50K - $75K</p>
                <p className="text-xs text-slate-500 mt-2">Rec room, bedroom, bathroom (800-1000 sq ft)</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <p className="text-sm font-semibold text-slate-600 mb-2">High-End Renovation</p>
                <p className="text-3xl font-black text-orange-600">$80K - $150K+</p>
                <p className="text-xs text-slate-500 mt-2">Full apartment, luxury finishes, bar, theater</p>
              </div>
            </div>
            <div className="mt-6 bg-blue-100 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Costs are typically $50-$100 per square foot in Toronto, depending on finishes and complexity.
              </p>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <Clock className="w-8 h-8 text-rose-600" />
            Typical Timeline
          </h2>
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-black text-rose-600">1</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Permits & Design</h3>
                  <p className="text-sm text-slate-600">2-4 weeks: City permits, finalize layout</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-black text-orange-600">2</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Framing & Rough-Ins</h3>
                  <p className="text-sm text-slate-600">7-14 days: Walls, plumbing, electrical, HVAC</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-black text-blue-600">3</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Insulation & Drywall</h3>
                  <p className="text-sm text-slate-600">5-10 days: Insulate, hang & finish drywall</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-black text-green-600">4</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Flooring & Finishing</h3>
                  <p className="text-sm text-slate-600">10-21 days: Paint, flooring, trim, fixtures</p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg border-l-4 border-rose-500">
              <p className="font-bold text-slate-900">Total Duration: 6-12 weeks</p>
              <p className="text-sm text-slate-600 mt-1">
                Permit approval can add 3-6 weeks to start date
              </p>
            </div>
          </div>
        </section>

        {/* Cost Breakdown */}
        <section className="mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-6">Cost Breakdown (800 sq ft basement)</h2>
          <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-4 font-bold text-slate-900">Item</th>
                  <th className="text-right p-4 font-bold text-slate-900">Cost Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-4">
                    <p className="font-semibold text-slate-900">Framing & Materials</p>
                    <p className="text-sm text-slate-600">Studs, plates, headers for walls</p>
                  </td>
                  <td className="p-4 text-right font-semibold text-slate-900">$3,000 - $6,000</td>
                </tr>
                <tr>
                  <td className="p-4">
                    <p className="font-semibold text-slate-900">Electrical</p>
                    <p className="text-sm text-slate-600">Wiring, outlets, lights, panel upgrade</p>
                  </td>
                  <td className="p-4 text-right font-semibold text-slate-900">$4,000 - $8,000</td>
                </tr>
                <tr>
                  <td className="p-4">
                    <p className="font-semibold text-slate-900">Plumbing</p>
                    <p className="text-sm text-slate-600">Bathroom rough-in, fixtures</p>
                  </td>
                  <td className="p-4 text-right font-semibold text-slate-900">$3,000 - $10,000</td>
                </tr>
                <tr>
                  <td className="p-4">
                    <p className="font-semibold text-slate-900">HVAC</p>
                    <p className="text-sm text-slate-600">Extend ductwork, add vents/returns</p>
                  </td>
                  <td className="p-4 text-right font-semibold text-slate-900">$2,000 - $5,000</td>
                </tr>
                <tr>
                  <td className="p-4">
                    <p className="font-semibold text-slate-900">Drywall & Ceiling</p>
                    <p className="text-sm text-slate-600">Hang, tape, mud, sand, paint</p>
                  </td>
                  <td className="p-4 text-right font-semibold text-slate-900">$6,000 - $12,000</td>
                </tr>
                <tr>
                  <td className="p-4">
                    <p className="font-semibold text-slate-900">Flooring</p>
                    <p className="text-sm text-slate-600">Vinyl plank, carpet, or engineered wood</p>
                  </td>
                  <td className="p-4 text-right font-semibold text-slate-900">$3,000 - $8,000</td>
                </tr>
                <tr>
                  <td className="p-4">
                    <p className="font-semibold text-slate-900">Bathroom (if included)</p>
                    <p className="text-sm text-slate-600">3-piece: toilet, sink, shower</p>
                  </td>
                  <td className="p-4 text-right font-semibold text-slate-900">$8,000 - $18,000</td>
                </tr>
                <tr>
                  <td className="p-4">
                    <p className="font-semibold text-slate-900">Permits & Inspections</p>
                    <p className="text-sm text-slate-600">Toronto building permit fees</p>
                  </td>
                  <td className="p-4 text-right font-semibold text-slate-900">$1,000 - $2,500</td>
                </tr>
                <tr className="bg-rose-50">
                  <td className="p-4">
                    <p className="font-bold text-slate-900">Labor (40-50% of total)</p>
                  </td>
                  <td className="p-4 text-right font-bold text-rose-600">$20,000 - $50,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Common Mistakes */}
        <section className="mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
            Common Mistakes to Avoid
          </h2>
          <div className="space-y-4">
            {[
              {
                title: "Skipping the Permit",
                description: "Toronto requires permits for basement finishing. Unpermitted work must be redone for resale and voids insurance.",
              },
              {
                title: "Inadequate Ceiling Height",
                description: "Toronto requires minimum 6'7\" ceiling height. Measure before planning work—some basements can't be legally finished.",
              },
              {
                title: "Ignoring Moisture Issues",
                description: "Fix foundation leaks and drainage BEFORE finishing. Drywall mold remediation costs $10,000+. Waterproofing pays off.",
              },
              {
                title: "No Emergency Egress",
                description: "Bedrooms need egress windows (large enough to escape through). This costs $3,000-$8,000 but is legally required.",
              },
              {
                title: "Insufficient Lighting",
                description: "Basements are dark. Plan for recessed lighting (every 6 ft), plus task lighting in work areas. Don't rely on wall-mounted fixtures alone.",
              },
            ].map((mistake, index) => (
              <div key={index} className="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-r-xl">
                <h3 className="font-bold text-slate-900 mb-2">❌ {mistake.title}</h3>
                <p className="text-sm text-slate-700">{mistake.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-rose-600 to-orange-600 rounded-2xl p-10 text-white text-center shadow-2xl">
          <Sparkles className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Get Your Basement Renovation Estimate
          </h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Answer a few questions and receive an instant AI-powered estimate tailored to your Toronto basement renovation
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white text-rose-600 font-black py-4 px-8 rounded-xl hover:bg-slate-100 transition-all transform hover:scale-105 shadow-lg text-lg"
          >
            Get Free Estimate
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm opacity-75 mt-4">
            Takes 2 minutes • No signup required • Connect with verified contractors
          </p>
        </section>

        {/* Related Guides */}
        <section className="mt-12">
          <h3 className="text-2xl font-black text-slate-900 mb-6">More Renovation Cost Guides</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/renovation-cost/toronto/bathroom"
              className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border-2 border-slate-200 hover:border-orange-400 transition group"
            >
              <h4 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-orange-600 transition">
                Bathroom Renovation Cost →
              </h4>
              <p className="text-sm text-slate-600">
                Complete pricing guide for Toronto bathroom remodels
              </p>
            </Link>
            <Link
              href="/renovation-cost/toronto/kitchen"
              className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border-2 border-slate-200 hover:border-orange-400 transition group"
            >
              <h4 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-orange-600 transition">
                Kitchen Renovation Cost →
              </h4>
              <p className="text-sm text-slate-600">
                Complete pricing guide for Toronto kitchen remodels
              </p>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link href="/" className="inline-block mb-4">
            <span className="text-2xl font-black bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
              QuoteXbert
            </span>
          </Link>
          <p className="text-sm opacity-75 mb-4">
            AI-powered renovation estimates for Toronto & GTA
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <Link href="/about" className="hover:text-orange-400 transition">About</Link>
            <Link href="/contact" className="hover:text-orange-400 transition">Contact</Link>
            <a href="tel:9052429460" className="hover:text-orange-400 transition">📞 905-242-9460</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
