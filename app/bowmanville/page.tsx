import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight, Star, CheckCircle, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home Renovation Estimates Bowmanville | QuoteXbert',
  description: 'Get instant AI-powered home renovation estimates in Bowmanville. Connect with verified local contractors for kitchen, bathroom, basement renovations & more.',
  keywords: ['Bowmanville contractors', 'Bowmanville renovation', 'home repair Bowmanville', 'Clarington contractors'],
  openGraph: {
    title: 'Home Renovation Estimates Bowmanville | QuoteXbert',
    description: 'Get instant AI-powered home renovation estimates in Bowmanville.',
    url: 'https://www.quotexbert.com/bowmanville',
  }
};

export default function BowmanvillePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-rose-600">Home</Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/durham-region" className="hover:text-rose-600">Durham Region</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Bowmanville</span>
          </div>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <MapPin className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-900">Proudly Serving Bowmanville</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              <span className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent">
                Instant Home Renovation<br />Estimates in Bowmanville
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
              Connect with trusted local contractors in Bowmanville and Clarington. Get AI-powered renovation estimates in minutes.
            </p>

            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-current" />
                <span className="font-semibold">4.8/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="font-semibold">Local Contractors</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="font-semibold">< 3min Estimates</span>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/create-lead"
                className="inline-block bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white font-bold py-5 px-10 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 text-lg transition-all"
              >
                📸 Upload Photos → Get Instant Estimate
              </Link>
              <p className="text-sm text-gray-600 mt-3">Free • No commitment • Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Why Bowmanville Homeowners Choose QuoteXbert
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Local expertise meets cutting-edge AI technology
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Local Contractors</h3>
              <p className="text-gray-600">
                Background-checked professionals who know Bowmanville building codes and neighborhoods
              </p>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8">
              <Clock className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Estimates</h3>
              <p className="text-gray-600">
                AI-powered estimates in under 3 minutes. No waiting days for contractor quotes
              </p>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8">
              <Star className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Top Rated Service</h3>
              <p className="text-gray-600">
                4.8/5 rating from hundreds of satisfied Durham Region homeowners
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-rose-600 via-red-600 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start Your Bowmanville Renovation Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join your neighbors who got instant, accurate renovation estimates
          </p>
          <Link
            href="/create-lead"
            className="inline-block bg-white text-rose-600 font-bold py-5 px-10 rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all text-lg"
          >
            Get Your Free Estimate Now →
          </Link>
        </div>
      </section>
    </main>
  );
}
