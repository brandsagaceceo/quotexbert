"use client";

import { Shield, MapPin, Users, Star } from 'lucide-react';

export function TrustSignals() {
  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-4">
            <Star className="w-5 h-5 text-amber-500 fill-current" />
            <span className="text-sm font-semibold text-gray-700">Trusted in Toronto</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Toronto's Most Trusted <br />Renovation Estimate Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Serving homeowners and contractors across the Greater Toronto Area
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {/* Google Rating */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-full p-3">
                <Star className="w-6 h-6 text-white fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-3xl font-bold text-gray-900">4.8</span>
                  <Star className="w-5 h-5 text-amber-400 fill-current" />
                </div>
                <p className="text-sm text-gray-600">Google Rating</p>
              </div>
            </div>
            <div className="flex gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 text-amber-400 fill-current" />
              ))}
            </div>
            <p className="text-xs text-gray-500">Based on 127+ reviews</p>
          </div>

          {/* Verified Contractors */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full p-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">150+</div>
                <p className="text-sm text-gray-600">Verified Contractors</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              All background-checked and licensed professionals
            </p>
          </div>

          {/* GTA Coverage */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full p-3">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">25+</div>
                <p className="text-sm text-gray-600">Cities Covered</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Toronto, Durham Region, and across the GTA
            </p>
          </div>

          {/* Happy Homeowners */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-to-br from-rose-400 to-pink-500 rounded-full p-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">2,500+</div>
                <p className="text-sm text-gray-600">Happy Homeowners</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Successful renovations completed in the GTA
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid md:grid-cols-3 gap-8 items-center text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-4">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Background Checked</h3>
                <p className="text-sm text-gray-600">All contractors verified & licensed</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl p-4">
                <MapPin className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Local Experts</h3>
                <p className="text-sm text-gray-600">Toronto & GTA specialists only</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-4">
                <Star className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Top Rated</h3>
                <p className="text-sm text-gray-600">4.8+ average customer rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Join thousands of satisfied Toronto homeowners
          </p>
          <a
            href="/create-lead"
            className="inline-block bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Get Your Free Estimate Now →
          </a>
        </div>
      </div>
    </section>
  );
}
