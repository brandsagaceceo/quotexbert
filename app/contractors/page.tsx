import { createApiUrl } from "@/lib/api-utils";
import Link from "next/link";
import { Metadata } from "next";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verified Contractors - Home Repair Professionals | QuotexBert",
  description: "Browse verified contractor profiles with portfolios, reviews, and ratings. Find trusted home repair professionals in your area on QuotexBert.",
  openGraph: {
    title: "Verified Contractors - Home Repair Pros",
    description: "Find verified contractors with portfolios, reviews, and professional ratings.",
    images: ["/og-contractors.jpg"],
  },
};

interface ContractorProfile {
  id: string;
  companyName: string;
  trade: string;
  bio?: string;
  city?: string;
  verified: boolean;
  avgRating: number;
  reviewCount: number;
  user: {
    id: string;
    email: string;
  };
}

export default async function ContractorsPage() {
  let contractors: ContractorProfile[] = [];

  try {
    const response = await fetch(createApiUrl("/api/contractors"), {
      cache: "no-store",
    });

    if (response.ok) {
      contractors = await response.json();
    }
  } catch (error) {
    console.error("Error fetching contractors:", error);
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < Math.floor(rating) ? "text-yellow-400" : "text-gray-400"
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Verified Contractors - Home Repair Professionals
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto mb-8">
            Browse verified contractor profiles with portfolios, reviews, and ratings. Find trusted home repair professionals in your area on QuotexBert.
          </p>
          
          {/* Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 border border-neutral-200">
              <div className="text-3xl mb-3">✅</div>
              <h3 className="font-semibold text-neutral-900 mb-2">Verified Professionals</h3>
              <p className="text-neutral-600 text-sm">Background checked and verified contractors</p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-neutral-200">
              <div className="text-3xl mb-3">⭐</div>
              <h3 className="font-semibold text-neutral-900 mb-2">Real Reviews</h3>
              <p className="text-neutral-600 text-sm">Authentic reviews from completed projects</p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-neutral-200">
              <div className="text-3xl mb-3">📸</div>
              <h3 className="font-semibold text-neutral-900 mb-2">Portfolio Showcase</h3>
              <p className="text-neutral-600 text-sm">View work samples and project galleries</p>
            </div>
          </div>
        </div>

        {contractors.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-neutral-200">
            <div className="w-16 h-16 mx-auto mb-4 text-neutral-400">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect x="30" y="30" width="40" height="40" fill="currentColor" rx="4" />
                <circle cx="40" cy="40" r="3" fill="#ff6b35" />
                <circle cx="60" cy="60" r="3" fill="#ff6b35" />
                <rect x="45" y="50" width="10" height="4" fill="#ff6b35" rx="2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              No contractors available yet
            </h3>
            <p className="text-neutral-600 mb-6">
              Check back soon as we add more verified contractors to the platform.
            </p>
            <Link
              href="/contractor/jobs"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Join as Contractor
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contractors.map((contractor) => (
              <Link
                key={contractor.id}
                href={`/contractors/${contractor.user.id}`}
                className="block bg-white rounded-lg border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {contractor.companyName}
                      </h3>
                      {contractor.verified && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3 text-sm text-neutral-600">
                      <div className="flex items-center gap-1">
                        <span className="text-blue-500">🔧</span>
                        <span className="capitalize">{contractor.trade}</span>
                      </div>
                      
                      {contractor.city && (
                        <div className="flex items-center gap-1">
                          <span className="text-green-500">📍</span>
                          <span>{contractor.city}</span>
                        </div>
                      )}
                    </div>

                    {contractor.avgRating > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">{renderStars(contractor.avgRating)}</div>
                        <span className="text-sm text-neutral-600">
                          {contractor.avgRating.toFixed(1)} ({contractor.reviewCount} reviews)
                        </span>
                      </div>
                    )}

                    {contractor.bio && (
                      <p className="text-neutral-600 text-sm line-clamp-3 mb-4">
                        {contractor.bio}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    View Profile →
                  </span>
                  <span className="text-xs text-neutral-500">
                    QuotexBert Verified
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Are you a contractor?
          </h2>
          <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
            Join QuotexBert and start connecting with homeowners in your area. Build your profile, showcase your work, and grow your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contractor/jobs"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Available Jobs
            </Link>
            <Link
              href="/about"
              className="bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Learn More About QuotexBert
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
