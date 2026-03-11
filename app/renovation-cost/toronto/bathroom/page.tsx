import Link from "next/link";
import { ArrowRight, CheckCircle, Clock, TrendingUp, AlertTriangle, Sparkles } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bathroom Renovation Cost Toronto 2026 | QuoteXbert Guide",
  description: "Complete bathroom renovation cost guide for Toronto & GTA. Average pricing, timeline, material breakdown, and common mistakes to avoid. Get instant AI estimate.",
  keywords: "bathroom renovation cost Toronto, bathroom remodel price GTA, Toronto bathroom renovation",
};

export default function BathroomRenovationCostPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-rose-600 to-orange-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="inline-block mb-6 text-sm hover:underline opacity-90">
            ← Back to QuoteXbert
          </Link>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Bathroom Renovation Cost in Toronto
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
              Average Bathroom Renovation Cost
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <p className="text-sm font-semibold text-slate-600 mb-2">Basic Refresh</p>
                <p className="text-3xl font-black text-blue-600">$5K - $10K</p>
                <p className="text-xs text-slate-500 mt-2">Paint, fixtures, minor updates</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md border-2 border-rose-400">
                <p className="text-sm font-semibold text-slate-600 mb-2">Mid-Range Remodel</p>
                <p className="text-3xl font-black text-rose-600">$15K - $25K</p>
                <p className="text-xs text-slate-500 mt-2">New tile, vanity, tub/shower</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <p className="text-sm font-semibold text-slate-600 mb-2">High-End Renovation</p>
                <p className="text-3xl font-black text-orange-600">$30K - $50K+</p>
                <p className="text-xs text-slate-500 mt-2">Luxury finishes, layout changes</p>
              </div>
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
                  <h3 className="font-bold text-slate-900">Design & Planning</h3>
                  <p className="text-sm text-slate-600">1-2 weeks: Finalize design, order materials</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-black text-orange-600">2</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Demolition</h3>
                  <p className="text-sm text-slate-600">1-3 days: Remove old fixtures, tile, drywall</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-black text-blue-600">3</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Rough-In Work</h3>
                  <p className="text-sm text-slate-600">3-5 days: Plumbing, electrical, framing</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-black text-green-600">4</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Installation & Finishing</h3>
                  <p className="text-sm text-slate-600">7-14 days: Tile, fixtures, paint, trim</p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg border-l-4 border-rose-500">
              <p className="font-bold text-slate-900">Total Duration: 2-4 weeks</p>
              <p className="text-sm text-slate-600 mt-1">
                Timeline varies based on complexity and material availability
              </p>
            </div>
          </div>
        </section>

        {/* Material Breakdown */}
        <section className="mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-6">Cost Breakdown</h2>
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
                    <p className="font-semibold text-slate-900">Vanity & Sink</p>
                    <p className="text-sm text-slate-600">Stock to custom cabinetry</p>
                  </td>
                  <td className="p-4 text-right font-semibold text-slate-900">$400 - $3,000</td>
                </tr>
                <tr>
                  <td className="p-4">
                    <p className="font-semibold text-slate-900">Toilet</p>
                    <p className="text-sm text-slate-600">Standard to high-efficiency</p>
                  </td>
                  <td className="p-4 text-right font-semibold text-slate-900">$150 - $800</td>
                </tr>
                <tr>
                  <td className="p-4">
                    <p className="font-semibold text-slate-900">Bathtub or Shower</p>
                    <p className="text-sm text-slate-600">Acrylic insert to tile custom</p>
                  </td>
                  <td className="p-4 text-right font-semibold text-slate-900">$800 - $5,000</td>
                </tr>
                <tr>
                  <td className="p-4">
                    <p className="font-semibold text-slate-900">Tile (Floor & Walls)</p>
                    <p className="text-sm text-slate-600">Ceramic to porcelain/natural stone</p>
                  </td>
                  <td className="p-4 text-right font-semibold text-slate-900">$1,500 - $6,000</td>
                </tr>
                <tr>
                  <td className="p-4">
                    <p className="font-semibold text-slate-900">Lighting & Electrical</p>
                    <p className="text-sm text-slate-600">Fixtures, fan, outlets, GFCI</p>
                  </td>
                  <td className="p-4 text-right font-semibold text-slate-900">$500 - $2,000</td>
                </tr>
                <tr>
                  <td className="p-4">
                    <p className="font-semibold text-slate-900">Plumbing Rough-In</p>
                    <p className="text-sm text-slate-600">New lines, drain work</p>
                  </td>
                  <td className="p-4 text-right font-semibold text-slate-900">$800 - $2,500</td>
                </tr>
                <tr className="bg-rose-50">
                  <td className="p-4">
                    <p className="font-bold text-slate-900">Labor (40-50% of total)</p>
                  </td>
                  <td className="p-4 text-right font-bold text-rose-600">$6,000 - $20,000</td>
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
                title: "Not Planning for Ventilation",
                description: "Proper exhaust fan is critical to prevent mold. Budget $200-$500 for quality fan with proper venting.",
              },
              {
                title: "Skipping Waterproofing",
                description: "Cutting corners on waterproof membrane saves $500 now but costs thousands in water damage later.",
              },
              {
                title: "Choosing Wrong Tile Size",
                description: "Large tiles in small bathrooms create more waste. Consult contractor on optimal tile dimensions.",
              },
              {
                title: "Ignoring Storage Needs",
                description: "Plan storage during design phase. Adding after construction is expensive and awkward.",
              },
              {
                title: "DIY Plumbing & Electrical",
                description: "Hire licensed professionals for plumbing/electrical. Insurance and resale value depend on permits.",
              },
            ].map((mistake, index) => (
              <div key={index} className="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-r-xl">
                <h3 className="font-bold text-slate-900 mb-2">❌ {mistake.title}</h3>
                <p className="text-sm text-slate-700">{mistake.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA to Estimate Tool */}
        <section className="bg-gradient-to-r from-rose-600 to-orange-600 rounded-2xl p-10 text-white text-center shadow-2xl">
          <Sparkles className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Get Your Bathroom Renovation Estimate
          </h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Answer a few questions and receive an instant AI-powered estimate tailored to your Toronto bathroom renovation
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
            <Link
              href="/renovation-cost/toronto/basement"
              className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border-2 border-slate-200 hover:border-orange-400 transition group"
            >
              <h4 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-orange-600 transition">
                Basement Renovation Cost →
              </h4>
              <p className="text-sm text-slate-600">
                Average pricing for GTA basement finishing projects
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
