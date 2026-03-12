import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Sparkles, TrendingUp, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Home Renovation Quotes Markham | Instant AI Estimates",
  description: "Get instant AI-powered renovation quotes for Markham homes. Kitchen, bathroom, basement renovations & more. Connect with verified local contractors. Free estimates in minutes.",
  keywords: [
    "Markham renovation quotes",
    "Markham contractors",
    "home renovation Markham",
    "Markham kitchen renovation",
    "Markham bathroom renovation",
    "basement finishing Markham",
    "renovation costs Markham",
    "contractors near me Markham"
  ],
  openGraph: {
    title: "Markham Home Renovation Quotes | QuoteXbert",
    description: "Instant AI-powered renovation estimates for Markham. Connect with verified local contractors. Free, fast, accurate.",
  },
};

export default function MarkhamPage() {
  const neighborhoods = [
    "Unionville", "Thornhill", "Markham Village", "Cornell", "Berczy Village",
    "Wismer Commons", "Angus Glen", "Buttonville", "Rouge Fairways", "Cachet"
  ];

  const services = [
    { name: "Kitchen Renovation", price: "$20,000 - $55,000" },
    { name: "Bathroom Renovation", price: "$11,000 - $30,000" },
    { name: "Basement Finishing", price: "$30,000 - $70,000" },
    { name: "Flooring Installation", price: "$4,500 - $16,000" },
    { name: "Painting Services", price: "$3,200 - $11,000" },
    { name: "Deck Construction", price: "$11,000 - $28,000" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-rose-600 to-orange-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-6 h-6" />
            <span className="text-rose-200 font-semibold">Serving Markham & York Region</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Markham Home Renovation Quotes
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-rose-100">
            Get instant AI-powered renovation estimates for your Markham home. Connect with verified local contractors in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/#instant-quote"
              className="bg-white text-rose-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-rose-50 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Get Free Estimate
            </Link>
            <Link 
              href="/contractors"
              className="bg-rose-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-rose-800 transition-all border-2 border-white/30 flex items-center justify-center"
            >
              Browse Contractors
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b-2 border-rose-100 py-6">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-rose-600">550+</div>
            <div className="text-sm text-gray-600">Markham Projects</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-rose-600">65+</div>
            <div className="text-sm text-gray-600">Local Contractors</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-rose-600">30 sec</div>
            <div className="text-sm text-gray-600">Average Response</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-rose-600">100%</div>
            <div className="text-sm text-gray-600">Free for Homeowners</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Services */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-rose-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-rose-600" />
              Popular Services in Markham
            </h2>
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{service.name}</span>
                  <span className="text-sm text-rose-600 font-semibold">{service.price}</span>
                </div>
              ))}
            </div>
            <Link 
              href="/#instant-quote"
              className="mt-6 w-full bg-gradient-to-r from-rose-600 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-rose-700 hover:to-orange-700 transition-all block text-center"
            >
              Get Your Free Estimate Now
            </Link>
          </div>

          {/* Neighborhoods */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-rose-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-rose-600" />
              Markham Areas We Serve
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {neighborhoods.map((neighborhood) => (
                <div key={neighborhood} className="flex items-center gap-2 p-2 bg-rose-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900">{neighborhood}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-rose-100 to-orange-100 rounded-lg">
              <p className="text-sm text-gray-800">
                <strong>Serving all of Markham</strong> including postal codes: L3P, L3R, L3S, L3T, L6B, L6C, L6E, L6G
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-rose-200 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Markham Homeowners Choose QuoteXbert
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-gradient-to-br from-rose-100 to-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Instant AI Estimates</h3>
              <p className="text-gray-600">Upload photos, get accurate Markham market pricing in 30 seconds</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-rose-100 to-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Verified Local Contractors</h3>
              <p className="text-gray-600">Connect with licensed, insured contractors who specialize in Markham</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-rose-100 to-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Real Local Pricing</h3>
              <p className="text-gray-600">Based on actual 2026 Markham renovation costs and labor rates</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-rose-600 to-orange-600 rounded-2xl shadow-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Markham Renovation?
          </h2>
          <p className="text-xl mb-8 text-rose-100">
            Join hundreds of satisfied Markham homeowners who got accurate estimates in minutes
          </p>
          <Link 
            href="/#instant-quote"
            className="inline-block bg-white text-rose-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-rose-50 transition-all shadow-lg"
          >
            Get Your Free Estimate Now →
          </Link>
          <p className="mt-4 text-sm text-rose-200">
            No credit card required • 100% free for homeowners • Instant results
          </p>
        </div>
      </div>
    </div>
  );
}
