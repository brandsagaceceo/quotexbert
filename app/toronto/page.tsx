import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight, Star, Home, Wrench, Clock, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Instant Home Renovation Estimates in Toronto | QuoteXbert',
  description: 'Get instant AI-powered home renovation estimates in Toronto. Upload photos, get free quotes from verified contractors across downtown, North York, Scarborough, Etobicoke & more.',
  keywords: ['Toronto renovation estimates', 'Toronto contractors', 'home renovation Toronto', 'Toronto home repair quotes', 'downtown Toronto contractors'],
  openGraph: {
    title: 'Instant Home Renovation Estimates in Toronto | QuoteXbert',
    description: 'Get instant AI-powered home renovation estimates in Toronto. Upload photos, get free quotes from verified contractors.',
    url: 'https://www.quotexbert.com/toronto',
  }
};

const torontoNeighborhoods = [
  'Downtown Toronto', 'North York', 'Scarborough', 'Etobicoke', 'East York',
  'Midtown Toronto', 'Yorkville', 'The Beaches', 'High Park', 'Liberty Village',
  'King West', 'Queen West', 'Leslieville', 'The Annex', 'Rosedale',
  'Forest Hill', 'Davisville Village', 'Lawrence Park', 'Don Mills', 'Willowdale'
];

const popularProjects = [
  { name: 'Bathroom Renovation', avgCost: '$12,000 - $25,000', duration: '2-4 weeks' },
  { name: 'Kitchen Remodel', avgCost: '$20,000 - $50,000', duration: '4-8 weeks' },
  { name: 'Basement Finishing', avgCost: '$30,000 - $65,000', duration: '6-10 weeks' },
  { name: 'Deck & Patio', avgCost: '$8,000 - $20,000', duration: '1-3 weeks' },
  { name: 'Flooring Installation', avgCost: '$3,000 - $12,000', duration: '1-2 weeks' },
  { name: 'Interior Painting', avgCost: '$2,500 - $8,000', duration: '3-7 days' },
];

export default function TorontoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10"></div>
        
        <div className="max-w-6xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-rose-600">Home</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Toronto</span>
          </div>

          <div className="text-center space-y-6">
            {/* Location Badge */}
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <MapPin className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-900">Serving Toronto & Surrounding Areas</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              <span className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent">
                Instant Home Renovation<br />Estimates in Toronto
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Get AI-powered renovation estimates in minutes. Connect with verified, background-checked contractors across all Toronto neighborhoods.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-current" />
                <span className="font-semibold">4.8/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="font-semibold">150+ Toronto Contractors</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="font-semibold">&lt;3min Estimates</span>
              </div>
            </div>

            {/* CTA */}
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

      {/* Toronto Neighborhoods Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              We Serve All Toronto Neighborhoods
            </h2>
            <p className="text-xl text-gray-600">
              From downtown condos to Scarborough homes, our contractors cover the entire city
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {torontoNeighborhoods.map((neighborhood) => (
              <div key={neighborhood} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 text-center hover:shadow-lg transition-shadow border border-slate-200">
                <MapPin className="w-5 h-5 text-rose-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-900">{neighborhood}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-gray-600">
              Don't see your neighborhood? We cover all of Toronto!{' '}
              <Link href="/create-lead" className="text-rose-600 font-semibold hover:underline">
                Get your free estimate →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Popular Projects in Toronto */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Renovation Projects in Toronto
            </h2>
            <p className="text-xl text-gray-600">
              Average costs and timelines for common Toronto home renovations
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

      {/* Why Choose QuoteXbert in Toronto */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Toronto Homeowners Choose QuoteXbert
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl p-6 w-20 h-20 mx-auto flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Verified Toronto Contractors</h3>
              <p className="text-gray-600">
                All contractors are background-checked, licensed, and insured. Only the best professionals serving Toronto homeowners.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-gradient-to-br from-rose-100 to-orange-100 rounded-2xl p-6 w-20 h-20 mx-auto flex items-center justify-center">
                <Clock className="w-10 h-10 text-rose-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Instant AI Estimates</h3>
              <p className="text-gray-600">
                Upload photos and get accurate renovation estimates in under 3 minutes. No more waiting days for contractor quotes.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-6 w-20 h-20 mx-auto flex items-center justify-center">
                <Home className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Local Expertise</h3>
              <p className="text-gray-600">
                Our contractors understand Toronto building codes, permits, and the unique challenges of renovating in the city.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-rose-600 via-red-600 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Toronto Renovation?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join 2,500+ happy Toronto homeowners who got instant, accurate renovation estimates with QuoteXbert
          </p>
          <Link
            href="/create-lead"
            className="inline-block bg-white text-rose-600 font-bold py-5 px-10 rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all text-lg"
          >
            Get Your Free Estimate Now →
          </Link>
          <p className="text-sm mt-4 opacity-75">100% Free • No Credit Card Required • 2 Minute Setup</p>
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
              "name": "QuoteXbert",
              "url": "https://www.quotexbert.com/toronto"
            },
            "areaServed": {
              "@type": "City",
              "name": "Toronto",
              "sameAs": "https://en.wikipedia.org/wiki/Toronto"
            },
            "description": "Instant AI-powered home renovation estimates in Toronto with verified contractors"
          })
        }}
      />
    </main>
  );
}
