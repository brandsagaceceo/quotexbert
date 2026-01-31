import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight, Star, CheckCircle, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home Renovation Estimates Ajax | QuoteXbert',
  description: 'Get instant AI-powered home renovation estimates in Ajax. Connect with verified local contractors for kitchen, bathroom, basement renovations & more in Ajax, Ontario.',
  keywords: ['Ajax contractors', 'Ajax renovation', 'home repair Ajax', 'Ajax kitchen renovation', 'Ajax basement finishing'],
  openGraph: {
    title: 'Home Renovation Estimates Ajax | QuoteXbert',
    description: 'Get instant AI-powered home renovation estimates in Ajax, Ontario.',
    url: 'https://www.quotexbert.com/ajax',
  }
};

export default function AjaxPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-rose-600">Home</Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/durham-region" className="hover:text-rose-600">Durham Region</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Ajax</span>
          </div>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <MapPin className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-900">Proudly Serving Ajax</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              <span className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent">
                Instant Home Renovation<br />Estimates in Ajax
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
              Connect with verified local contractors serving Ajax and surrounding Durham Region. Get AI-powered renovation estimates instantly.
            </p>

            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-current" />
                <span className="font-semibold">4.8/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="font-semibold">Verified Contractors</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="font-semibold">&lt;3min Estimates</span>
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
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Popular Renovation Projects in Ajax
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Basement Finishing', cost: '$25,000 - $50,000' },
              { name: 'Kitchen Renovation', cost: '$18,000 - $42,000' },
              { name: 'Bathroom Remodel', cost: '$10,000 - $20,000' },
              { name: 'Deck & Patio', cost: '$7,000 - $16,000' },
              { name: 'Flooring', cost: '$2,500 - $9,000' },
              { name: 'Interior Painting', cost: '$2,000 - $7,000' }
            ].map((project) => (
              <div key={project.name} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{project.name}</h3>
                <p className="text-gray-600 text-sm mb-4">Avg: {project.cost}</p>
                <Link 
                  href="/create-lead"
                  className="text-rose-600 font-semibold hover:text-rose-700 text-sm flex items-center gap-1"
                >
                  Get Estimate <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Why Ajax Homeowners Choose QuoteXbert
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Local Ajax Contractors</h3>
              <p className="text-gray-600">
                Work with contractors who know Ajax neighborhoods, bylaws, and building codes
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <Clock className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Estimates</h3>
              <p className="text-gray-600">
                Upload photos and get AI-powered estimates in under 3 minutes
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <Star className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Top Rated</h3>
              <p className="text-gray-600">
                Trusted by hundreds of Durham Region homeowners with 4.8/5 rating
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-rose-600 via-red-600 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start Your Ajax Renovation Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join your Ajax neighbors who got instant, accurate renovation estimates
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
