"use client";

import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
  image?: string;
  projectType?: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
  showExamples?: boolean;
}

// Example reviews clearly labeled
const EXAMPLE_REVIEWS: Review[] = [
  {
    id: "example-1",
    name: "Sarah M.",
    location: "Toronto, ON",
    rating: 5,
    text: "Got quotes from GTA contractors in under 5 minutes. The AI estimate was remarkably accurate compared to the final bids I received. Saved me so much time!",
    date: "2026-01-10",
    verified: false,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    projectType: "Kitchen Renovation",
  },
  {
    id: "example-2",
    name: "Mike R.",
    location: "Oshawa, ON",
    rating: 5,
    text: "Found a reliable roofing contractor through QuoteXbert. The photo upload feature made it super easy to show exactly what needed fixing. Highly recommend!",
    date: "2026-01-08",
    verified: false,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    projectType: "Roofing Repair",
  },
  {
    id: "example-3",
    name: "Jennifer L.",
    location: "Whitby, ON",
    rating: 5,
    text: "The instant estimate feature is a game-changer! I uploaded photos of my bathroom and got a detailed breakdown within seconds. Made budgeting so much easier.",
    date: "2026-01-05",
    verified: false,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    projectType: "Bathroom Remodel",
  },
  {
    id: "example-4",
    name: "David P.",
    location: "Pickering, ON",
    rating: 5,
    text: "QuoteXbert connected me with three excellent contractors for my deck project. All were licensed, insured, and very professional. Project came in on budget!",
    date: "2025-12-28",
    verified: false,
    projectType: "Deck Building",
  },
  {
    id: "example-5",
    name: "Lisa K.",
    location: "Ajax, ON",
    rating: 5,
    text: "Best contractor platform I've used. The AI estimate gave me realistic expectations, and the contractors I connected with were all top-notch. Will use again!",
    date: "2025-12-20",
    verified: false,
    projectType: "Basement Finishing",
  },
  {
    id: "example-6",
    name: "Robert T.",
    location: "Bowmanville, ON",
    rating: 5,
    text: "Impressed with how accurate the AI estimate was. Got my electrical work done by a great contractor I found through the platform. Smooth process from start to finish.",
    date: "2025-12-15",
    verified: false,
    projectType: "Electrical Work",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        star <= rating ? (
          <StarIcon key={star} className="w-5 h-5 text-yellow-500" />
        ) : (
          <StarOutlineIcon key={star} className="w-5 h-5 text-slate-300" />
        )
      ))}
    </div>
  );
}

function ReviewCard({ review, isExample }: { review: Review; isExample: boolean }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-200 relative">
      {isExample && (
        <div className="absolute top-4 right-4 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
          Example
        </div>
      )}
      
      <div className="flex items-start gap-4 mb-4">
        {review.image && (
          <Image
            src={review.image}
            alt={review.name}
            width={60}
            height={60}
            className="rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-slate-900">{review.name}</h4>
            {review.verified && (
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <p className="text-sm text-slate-600">{review.location}</p>
          {review.projectType && (
            <p className="text-xs text-orange-600 font-semibold mt-1">{review.projectType}</p>
          )}
        </div>
      </div>

      <div className="mb-3">
        <StarRating rating={review.rating} />
      </div>

      <p className="text-slate-700 leading-relaxed mb-3">{review.text}</p>

      <p className="text-xs text-slate-500">
        {new Date(review.date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </p>
    </div>
  );
}

export function ReviewsSection({ reviews, showExamples = true }: ReviewsSectionProps) {
  // Use real reviews if available, otherwise show examples
  const displayReviews = reviews.length > 0 ? reviews : (showExamples ? EXAMPLE_REVIEWS : []);
  const hasRealReviews = reviews.length > 0;

  // Generate schema markup only for verified reviews
  const verifiedReviews = displayReviews.filter(r => r.verified);
  const reviewSchema = verifiedReviews.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "QuoteXbert",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": (verifiedReviews.reduce((sum, r) => sum + r.rating, 0) / verifiedReviews.length).toFixed(1),
      "reviewCount": verifiedReviews.length,
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": verifiedReviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.name
      },
      "datePublished": review.date,
      "reviewBody": review.text,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": "5",
        "worstRating": "1"
      }
    }))
  } : null;

  if (displayReviews.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
      {reviewSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block mb-3 px-5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full">
            <span className="text-sm font-bold">
              {hasRealReviews ? "REAL REVIEWS" : "EXAMPLE REVIEWS"}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            {hasRealReviews ? "What Homeowners Are Saying" : "See How It Works"}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {hasRealReviews 
              ? "Real reviews from homeowners who used QuoteXbert to complete their projects"
              : "Example testimonials showing how QuoteXbert helps homeowners. Real reviews will be displayed as customers complete their projects."
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayReviews.slice(0, 6).map((review) => (
            <ReviewCard key={review.id} review={review} isExample={!review.verified} />
          ))}
        </div>

        {!hasRealReviews && (
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600 bg-white/80 backdrop-blur-sm border border-slate-300 rounded-lg px-6 py-3 inline-block">
              ℹ️ These are example reviews. Real customer reviews will appear here as homeowners complete their projects.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
