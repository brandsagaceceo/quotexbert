import Link from "next/link";
import { ArrowRight, CheckCircle, Clock, TrendingUp, AlertTriangle, Sparkles } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kitchen Renovation Cost Toronto 2026 | QuoteXbert Guide",
  description: "Complete kitchen renovation cost guide for Toronto & GTA. Average pricing, timeline, cabinet & appliance costs, and expert tips. Get instant AI estimate.",
  keywords: "kitchen renovation cost Toronto, kitchen remodel price GTA, Toronto kitchen renovation",
};

export default function KitchenRenovationCostPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-rose-600 to-orange-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="inline-block mb-6 text-sm hover:underline opacity-90">
            ← Back to QuoteXbert
          </Link>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Kitchen Renovation Cost in Toronto
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
              Average Kitchen Renovation Cost
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <p className="text-sm font-semibold text-slate-600 mb-2">Minor Update</p>
                <p className="text-3xl font-black text-blue-600">$15K - $30K</p>
                <p className="text-xs text-slate-500 mt-2">Paint, hardware, countertops</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md border-2 border-rose-400">
                <p className="text-sm font-semibold text-slate-600 mb-2">Mid-Range Remodel</p>
                <p className="text-3xl font-black text-rose-600">$40K - $70K</p>
                <p className="text-xs text-slate-500 mt-2">New cabinets, appliances, flooring</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <p className="text-sm font-semibold text-slate-600 mb-2">High-End Renovation</p>
                <p className="text-3xl font-black text-orange-600">$80K - $150K+</p>
                <p className="text-xs text-slate-500 mt-2">Custom cabinets, luxury finishes</p>
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
                  <h3 className="font-bold text-slate-900">Design & Ordering</h3>
                  <p className="text-sm text-slate-600">2-4 weeks: Finalize design, order cabinets & appliances</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-black text-orange-600">2</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Demolition</h3>
                  <p className="text-sm text-slate-600">2-4 days: Remove cabinets, counters, flooring</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-black text-blue-600">3</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Rough-In Work</h3>
                  <p className="text-sm text-slate-600">4-7 days: Plumbing, electrical, HVAC updates</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-black text-green-600">4</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Installation & Finishing</h3>
                  <p className="text-sm text-slate-600">10-21 days: Cabinets, counters, backsplash, appliances</p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg border-l-4 border-rose-500">
              <p className="font-bold text-slate-900">Total Duration: 4-8 weeks</p>
              <p className="text-sm text-slate-600 mt-1">
                Cabinet lead times can extend project duration by 6-10 weeks
              </p>
            </div>
          </div>
        </section>

        {/* Cost Breakdown */}
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
                    <p className="font-semibold text-slate-900">Cabinets</p>
                    <p className="text-sm text-slate-600">Stock to custom hardwood</p>
                  </td>
                  <td className="p-4 text-right font-semibold text-slate-900">$8,000 - $40,000</td>
                </tr>
                <tr>
                  <td className="p-4">
                    <p className="font-semibold text-slate-900">Countertops</p>
                    <p className="text-sm text-slate-600">Laminate to quartz/granite</p>
                  </td>
                  <td className="p-4 text-right font-semibold text-slate-900">$2,000 - $8,000</td>
                </tr>
                <tr>
                  <td className="p-4">
                    <p className="font-semibold text-slate-900">Appliances (Full Set)</p>
                    <p className="text-sm text-slate-600">Fridge, stove, dishwasher, microwave</p>
                  </td>
                  <td className="p-4 text-right font-semibold text-slate-900">$3,000 - $15,000</td>
                </tr>
                <tr>
                  <td className="p-4">
                    <p className="font-semibold text-slate-900">Flooring</p>
                    <p className="text-sm text-slate-600">Vinyl to hardwood/tile (150-200 sq ft)</p>
                  </td>
                  <td className="p-4 text-right font-semibold text-slate-900">$1,500 - $6,000</td>
                </tr>
                <tr>
                  <td className="p-4">
                    <p className="font-semibold text-slate-900">Backsplash</p>
                    <p className="text-sm text-slate-600">Ceramic to glass/stone tile</p>
                  </td>
                  <td className="p-4 text-right font-semibold text-slate-900">$800 - $3,000</td>
                </tr>
                <tr>
                  <td className="p-4">
                    <p className="font-semibold text-slate-900">Sink & Faucet</p>
                    <p className="text-sm text-slate-600">Undermount sink, pull-down faucet</p>
                  </td>
                  <td className="p-4 text-right font-semibold text-slate-900">$500 - $2,000</td>
                </tr>
                <tr>
                  <td className="p-4">
                    <p className="font-semibold text-slate-900">Lighting & Electrical</p>
                    <p className="text-sm text-slate-600">Under-cabinet, recessed, pendant lights</p>
                  </td>
                  <td className="p-4 text-right font-semibold text-slate-900">$1,000 - $4,000</td>
                </tr>
                <tr className="bg-rose-50">
                  <td className="p-4">
                    <p className="font-bold text-slate-900">Labor (35-45% of total)</p>
                  </td>
                  <td className="p-4 text-right font-bold text-rose-600">$14,000 - $50,000</td>
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
                title: "Choosing Cabinets First",
                description: "Decide on layout and workflow first. Cabinet configuration should follow function, not the other way around.",
              },
              {
                title: "Ignoring the Work Triangle",
                description: "Keep sink, stove, and fridge within 4-9 feet of each other for efficient workflow. Poor layout costs you daily.",
              },
              {
                title: "Insufficient Lighting",
                description: "Plan for task lighting (under-cabinet), ambient (recessed), and accent (pendant). One ceiling fixture isn't enough.",
              },
              {
                title: "Skimping on Outlets",
                description: "Install outlets every 4 feet on counters. USB outlets near charging station. Plan for small appliances.",
              },
              {
                title: "Not Planning for Storage",
                description: "Maximize storage with pull-out drawers, corner solutions, and pantry organization. Add 20% more storage than you think you need.",
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
            Get Your Kitchen Renovation Estimate
          </h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Answer a few questions and receive an instant AI-powered estimate tailored to your Toronto kitchen renovation
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
