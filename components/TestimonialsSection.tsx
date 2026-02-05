"use client";

import { Star, MapPin, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  project: string;
  savings?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "Midtown Toronto",
    rating: 5,
    text: "Got my bathroom renovation estimate in under 3 minutes! The AI was surprisingly accurate compared to what contractors quoted. Saved me so much time.",
    project: "Bathroom Renovation",
    savings: "$2,800"
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Scarborough",
    rating: 5,
    text: "I was skeptical at first, but QuoteXbert connected me with 3 verified contractors within hours. The estimate gave me confidence I wasn't being overcharged.",
    project: "Kitchen Remodel",
    savings: "$5,200"
  },
  {
    id: 3,
    name: "Jennifer Liu",
    location: "North York",
    rating: 5,
    text: "Finally, a platform that makes getting renovation quotes painless. No more waiting days for contractors to show up. The instant estimate was spot-on!",
    project: "Basement Finishing"
  },
  {
    id: 4,
    name: "David Patel",
    location: "Whitby",
    rating: 5,
    text: "Used QuoteXbert for my deck replacement. The AI estimate helped me negotiate with contractors. All verified professionals, no scams. Highly recommend!",
    project: "Deck Replacement",
    savings: "$1,500"
  },
  {
    id: 5,
    name: "Amanda Rodriguez",
    location: "Ajax",
    rating: 5,
    text: "As a first-time homeowner, I had no idea what renovations should cost. QuoteXbert gave me the knowledge I needed to make smart decisions.",
    project: "Full Home Renovation"
  },
  {
    id: 6,
    name: "Robert Kim",
    location: "Bowmanville",
    rating: 5,
    text: "Impressive accuracy! I uploaded photos of my outdated bathroom, and the AI nailed the estimate. Contractor bids came in within 10% of the prediction.",
    project: "Bathroom & Flooring",
    savings: "$900"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-4">
            <Star className="w-5 h-5 text-amber-500 fill-current" />
            <span className="text-sm font-semibold text-gray-700">4.9/5 from 43 reviews</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Trusted by Toronto Homeowners
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories from real people across the GTA who saved time and money with QuoteXbert
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10">
                <Quote className="w-16 h-16 text-rose-600" />
              </div>

              {/* Header */}
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{testimonial.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{testimonial.location}</span>
                  </div>
                </div>
                {testimonial.savings && (
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                    Saved {testimonial.savings}
                  </div>
                )}
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 mb-4 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Project Type */}
              <div className="text-sm text-gray-500 font-medium border-t pt-3">
                Project: {testimonial.project}
              </div>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-rose-600 mb-2">2,500+</div>
              <div className="text-sm text-gray-600">Happy Homeowners</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">4.8★</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">$3.2M</div>
              <div className="text-sm text-gray-600">Total Projects</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-rose-700 mb-2">&lt;3min</div>
              <div className="text-sm text-gray-600">Avg. Estimate Time</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-700 mb-6 text-lg">
            Ready to join them? Get your free instant estimate now.
          </p>
          <a
            href="/create-lead"
            className="inline-block bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white font-bold py-5 px-10 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
          >
            📸 Upload Photos – Get Free Estimate
          </a>
        </div>
      </div>
    </section>
  );
}
