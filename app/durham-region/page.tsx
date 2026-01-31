import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight, Star, Home, Wrench, Clock, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home Renovation Estimates Durham Region | QuoteXbert',
  description: 'Get instant AI-powered home renovation estimates in Durham Region. Serving Oshawa, Whitby, Ajax, Pickering, Bowmanville & Clarington. Free quotes from verified contractors.',
  keywords: ['Durham Region contractors', 'Oshawa renovation', 'Whitby contractors', 'Ajax home repair', 'Pickering renovation quotes'],
  openGraph: {
    title: 'Home Renovation Estimates Durham Region | QuoteXbert',
    description: 'Get instant AI-powered home renovation estimates across Durham Region.',
    url: 'https://www.quotexbert.com/durham-region',
  }
};

const durhamCities = [
  { name: 'Oshawa', population: '170,000+' },
  { name: 'Whitby', population: '140,000+' },
  { name: 'Ajax', population: '120,000+' },
  { name: 'Pickering', population: '95,000+' },
  { name: 'Bowmanville', population: '45,000+' },
  { name: 'Clarington', population: '100,000+' },
  { name: 'Courtice', population: '20,000+' },
  { name: 'Brooklin', population: '15,000+' },
];

const popularProjects = [
  { name: 'Basement Finishing', avgCost: '$25,000 - $55,000', duration: '6-10 weeks' },
  { name: 'Kitchen Renovation', avgCost: '$18,000 - $45,000', duration: '4-8 weeks' },
  { name: 'Bathroom Remodel', avgCost: '$10,000 - $22,000', duration: '2-4 weeks' },
  { name: 'Deck & Patio', avgCost: '$7,000 - $18,000', duration: '1-3 weeks' },
  { name: 'Roof Replacement', avgCost: '$8,000 - $16,000', duration: '2-5 days' },
  { name: 'Flooring', avgCost: '$2,500 - $10,000', duration: '1-2 weeks' },
];

export default function DurhamRegionPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10"></div>
        
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-rose-600">Home</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Durham Region</span>
          </div>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <MapPin className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-900">Serving All Durham Region Cities</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              <span className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent">
                Instant Home Renovation<br />Estimates in Durham Region
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Connect with verified contractors in Oshawa, Whitby, Ajax, Pickering, Bowmanville, and throughout Durham Region. Get AI-powered estimates in minutes.
            </p>

            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-current" />
                <span className="font-semibold">4.8/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="font-semibold">80+ Durham Contractors</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="font-semibold">&lt;3min Estimates</span>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/create-lead"
                className="inline-block bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white font-bold py-5 px-10 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
              >
                📸 Upload Photos → Get Instant Estimate
              </Link>
              <p className="text-sm text-gray-600 mt-3">Free • No commitment • Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Durham Cities */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted Contractors Across Durham Region
            </h2>
            <p className="text-xl text-gray-600">
              From lakefront properties to growing suburban communities
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {durhamCities.map((city) => (
              <Link
                key={city.name}
                href={`/${city.name.toLowerCase().replace(' ', '-')}`}
                className="bg-gradient-to-br from-white to-slate-50 rounded-xl p-6 text-center hover:shadow-xl transition-all border border-slate-200 hover:border-rose-300 group"
              >
                <MapPin className="w-8 h-8 text-rose-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg text-gray-900 mb-1">{city.name}</h3>
                <p className="text-sm text-gray-600">{city.population} residents</p>
                <span className="text-rose-600 text-sm font-semibold mt-3 inline-block group-hover:underline">
                  View Details →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Projects */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Renovation Projects in Durham Region
            </h2>
            <p className="text-xl text-gray-600">
              Average costs for Durham Region homeowners
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularProjects.map((project) => (
              <div key={project.name} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-rose-100 to-orange-100 rounded-xl p-3">
                    <Wrench className="w-6 h-6 text-rose-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{project.name}</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-semibold">Cost:</span>
                        <span>{project.avgCost}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{project.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link 
                    href="/create-lead"
                    className="text-rose-600 font-semibold hover:text-rose-700 text-sm flex items-center gap-1"
                  >
                    Get Instant Estimate <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Durham Homeowners Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Durham Region Homeowners Trust QuoteXbert
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl p-6 w-20 h-20 mx-auto flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Local Durham Contractors</h3>
              <p className="text-gray-600">
                Work with contractors who know Durham Region neighborhoods, building codes, and weather considerations.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-6 w-20 h-20 mx-auto flex items-center justify-center">
                <Clock className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Fast & Accurate Estimates</h3>
              <p className="text-gray-600">
                AI-powered estimates based on thousands of Durham Region renovation projects.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-6 w-20 h-20 mx-auto flex items-center justify-center">
                <Home className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Transparent Pricing</h3>
              <p className="text-gray-600">
                Know what you're paying before committing. No hidden fees or surprise charges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-rose-600 via-red-600 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Durham Region Renovation?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of Durham Region homeowners who got instant, accurate renovation estimates
          </p>
          <Link
            href="/create-lead"
            className="inline-block bg-white text-rose-600 font-bold py-5 px-10 rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all text-lg"
          >
            Get Your Free Estimate Now →
          </Link>
          <p className="text-sm mt-4 opacity-75">100% Free • No Credit Card Required</p>
        </div>
      </section>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Home Renovation Estimates",
            "provider": {
              "@type": "HomeAndConstructionBusiness",
              "name": "QuoteXbert"
            },
            "areaServed": [
              { "@type": "City", "name": "Oshawa" },
              { "@type": "City", "name": "Whitby" },
              { "@type": "City", "name": "Ajax" },
              { "@type": "City", "name": "Pickering" },
              { "@type": "City", "name": "Bowmanville" },
              { "@type": "City", "name": "Clarington" }
            ]
          })
        }}
      />
    </main>
  );
}
