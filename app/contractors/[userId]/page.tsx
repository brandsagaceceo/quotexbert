"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import Image from "next/image";

interface ContractorProfile {
  id: string;
  companyName: string;
  trade: string;
  bio?: string;
  city?: string;
  serviceRadiusKm: number;
  website?: string;
  phone?: string;
  verified: boolean;
  avgRating: number;
  reviewCount: number;
  user: {
    email: string;
    createdAt: string;
  };
}

interface PortfolioItem {
  id: string;
  title: string;
  caption?: string;
  imageUrl: string;
  createdAt: string;
}

interface Review {
  id: string;
  rating: number;
  text?: string;
  createdAt: string;
  homeowner: {
    id: string;
    email: string;
  };
}

export default function ContractorProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  
  const [profile, setProfile] = useState<ContractorProfile | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContractorData = async () => {
      try {
        setLoading(true);
        
        // Fetch contractor profile
        const profileResponse = await fetch(`/api/contractors/profile?userId=${userId}`);
        if (!profileResponse.ok) {
          throw new Error("Profile not found");
        }
        const profileData = await profileResponse.json();
        setProfile(profileData.profile);

        // Fetch portfolio
        const portfolioResponse = await fetch(`/api/contractors/portfolio?contractorId=${profileData.profile.id}`);
        if (portfolioResponse.ok) {
          const portfolioData = await portfolioResponse.json();
          setPortfolio(portfolioData.portfolioItems || []);
        }

        // Fetch reviews
        const reviewsResponse = await fetch(`/api/reviews?contractorId=${userId}&limit=5`);
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData.reviews || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchContractorData();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="bg-gray-800 rounded-lg p-8 mb-8">
              <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Profile Not Found</h2>
            <p className="text-gray-300">{error || "This contractor profile does not exist."}</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < Math.floor(rating) ? "text-yellow-400" : "text-gray-600"
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <>
      <Head>
        <title>Verified Contractors - Home Repair Professionals | QuotexBert</title>
        <meta name="description" content="Browse verified contractor profiles with portfolios, reviews, and ratings. Find trusted home repair professionals in your area on QuotexBert." />
        <meta property="og:title" content="Verified Contractors - Home Repair Pros" />
        <meta property="og:description" content="Find verified contractors with portfolios, reviews, and professional ratings." />
        <meta property="og:image" content="/og-contractors.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      
      <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-white">{profile.companyName}</h1>
                {profile.verified && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    ✓ Verified
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-6 mb-4 text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">🔧</span>
                  <span className="capitalize">{profile.trade}</span>
                </div>
                
                {profile.city && (
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400">📍</span>
                    <span>{profile.city}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">📏</span>
                  <span>{profile.serviceRadiusKm}km service radius</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  {renderStars(profile.avgRating)}
                  <span className="text-lg font-bold text-white">
                    {profile.avgRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-400">
                  ({profile.reviewCount} review{profile.reviewCount !== 1 ? 's' : ''})
                </span>
              </div>

              {profile.bio && (
                <p className="text-gray-300 mb-6 leading-relaxed">{profile.bio}</p>
              )}

              {/* Contact */}
              <div className="flex flex-wrap gap-4">
                {profile.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    📞 Call {profile.phone}
                  </a>
                )}
                
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    🌐 Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* About Me Section */}
        {profile.bio && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">About Me</h2>
            <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
            <div className="mt-4 text-sm text-gray-400">
              Professional {profile.trade} with experience serving {profile.city}. 
              {profile.verified && " ✅ QuotexBert Verified - Background checked, licensed, and insured professional."}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Portfolio */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Portfolio</h2>
              <p className="text-gray-400 mb-6">View my recent work and see the quality that sets me apart. Each project showcases attention to detail and customer satisfaction.</p>
              
              {portfolio.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No portfolio items available yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {portfolio.map((item) => (
                    <div key={item.id} className="bg-gray-700 rounded-lg overflow-hidden">
                      <div className="relative h-48">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                        {item.caption && (
                          <p className="text-gray-300 text-sm mb-2">{item.caption}</p>
                        )}
                        <p className="text-gray-500 text-xs">
                          {formatDate(item.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Reviews</h2>
              <p className="text-gray-400 mb-6">What my customers say about their experience. Every review is verified from completed QuotexBert projects.</p>
              
              {reviews.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No reviews yet.
                </p>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-700 pb-4 last:border-b-0">
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-400">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      
                      {review.text && (
                        <p className="text-gray-300 mb-2 leading-relaxed">{review.text}</p>
                      )}
                      
                      <p className="text-sm text-gray-500">
                        — {review.homeowner.email.split('@')[0]}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SEO and structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: profile.companyName,
              description: profile.bio,
              address: {
                "@type": "PostalAddress",
                addressLocality: profile.city,
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: profile.avgRating,
                reviewCount: profile.reviewCount,
              },
              telephone: profile.phone,
              url: profile.website,
            }),
          }}
        />
      </div>
      </div>
    </>
  );
}
