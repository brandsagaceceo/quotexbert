"use client";

import Link from "next/link";
import { MapPin, CheckCircle, Users, Zap } from "lucide-react";

const locations = [
  {
    name: "Toronto",
    description: "Find verified contractors and get instant home repair estimates across Toronto",
    stats: "500+ contractors available"
  },
  {
    name: "Whitby",
    description: "Quality home repair contractors serving Whitby and surrounding areas",
    stats: "100+ contractors available"
  },
  {
    name: "Greater Toronto Area (GTA)",
    description: "Connecting homeowners with skilled contractors across the entire GTA region",
    stats: "1000+ contractors available"
  }
];

const services = [
  "Basement Renovations",
  "Kitchen Renovations",
  "Bathroom Renovations",
  "Roofing & Repairs",
  "Plumbing Services",
  "Electrical Work",
  "Painting & Drywall",
  "Flooring Installation",
  "Window & Door Replacement",
  "HVAC Installation & Repair",
  "Deck & Patio Construction",
  "Masonry & Brickwork"
];

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-orange-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Local Home Repair Contractors Near You
          </h1>
          <p className="text-xl text-white/90">
            Find verified contractors in Toronto, Whitby, and the Greater Toronto Area
          </p>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-slate-900">
            Serving Toronto & GTA
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {locations.map((location) => (
              <div 
                key={location.name}
                className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <MapPin className="h-6 w-6 text-rose-700 mr-3" />
                  <h3 className="text-xl font-bold text-slate-900">{location.name}</h3>
                </div>
                <p className="text-slate-600 mb-4">{location.description}</p>
                <p className="text-sm font-semibold text-rose-700">{location.stats}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-slate-900">
            Services We Connect You With
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div 
                key={service}
                className="bg-white rounded-lg p-4 flex items-center shadow-md hover:shadow-lg transition-shadow"
              >
                <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-slate-700 font-medium">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why QuoteXbert Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-slate-900">
            Why Choose QuoteXbert?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <Zap className="h-8 w-8 text-rose-700 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Instant AI Estimates</h3>
                <p className="text-slate-600">
                  Get accurate home repair estimates in seconds using our advanced AI technology
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Users className="h-8 w-8 text-rose-700 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Verified Contractors</h3>
                <p className="text-slate-600">
                  All contractors are background-checked and verified for quality and reliability
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Secure Payments</h3>
                <p className="text-slate-600">
                  All payments are processed securely through Stripe. Only pay when work is complete
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <MapPin className="h-8 w-8 text-rose-700 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Local Expertise</h3>
                <p className="text-slate-600">
                  Our contractors know the Toronto and Whitby markets and local building codes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-orange-600">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Your Free Estimate?</h2>
          <p className="text-lg text-white/90 mb-8">
            Post your project and get quotes from verified contractors in your area
          </p>
          <Link 
            href="/create-lead"
            className="inline-block bg-white text-rose-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Get Free Estimates
          </Link>
        </div>
      </section>
    </div>
  );
}
