"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { ReviewsList } from "@/components/ReviewsList";
import LoadingState from "@/components/ui/LoadingState";
import {
  MapPin,
  Phone,
  Globe,
  Mail,
  Star,
  Award,
  Briefcase,
  CheckCircle2,
  MessageCircle
} from "lucide-react";
import PortfolioLikeButton from "@/components/PortfolioLikeButton";

interface ContractorProfile {
  id: string;
  userId: string;
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
  profilePhoto?: string;
  completedJobs: number;
  categories?: string[];
  serviceAreas?: string[];
  portfolio?: any[];
  avgResponseTimeMinutes?: number;
  responseTimeLabel?: string;
}

export default function ContractorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn, authUser, authLoading } = useAuth();
  const [contractor, setContractor] = useState<ContractorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contractorId = params.id as string;

  useEffect(() => {
    if (authLoading) return;
    if (!isSignedIn || !authUser) {
      router.push("/sign-in");
      return;
    }
    fetchContractorProfile();
  }, [isSignedIn, authUser, authLoading, contractorId]);

  const fetchContractorProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/contractors/profile?userId=${contractorId}`);
      
      if (!response.ok) {
        throw new Error("Failed to load contractor profile");
      }

      const data = await response.json();
      const rawProfile = data.profile;
      if (rawProfile) {
        // categories is stored as a JSON string in DB (e.g. '["Painting","Drywall"]')
        // parse it to an array so .map() in the render doesn't crash
        const safeCats = typeof rawProfile.categories === 'string'
          ? (() => { try { return JSON.parse(rawProfile.categories); } catch { return []; } })()
          : (Array.isArray(rawProfile.categories) ? rawProfile.categories : []);
        setContractor({ ...rawProfile, categories: safeCats });
      } else {
        setContractor(createDemoProfile());
      }
    } catch (err) {
      console.error("Error fetching contractor profile:", err);
      setError("Unable to load contractor profile. Please try again.");
      // For demo purposes, use sample data
      setContractor(createDemoProfile());
    } finally {
      setIsLoading(false);
    }
  };

  const createDemoProfile = (): ContractorProfile => {
    return {
      id: contractorId,
      userId: contractorId,
      companyName: "Demo Construction Co.",
      trade: "General Contractor",
      bio: "Professional construction company with 15+ years of experience in residential renovations. We specialize in kitchens, bathrooms, and whole-home renovations with a focus on quality craftsmanship and customer satisfaction.",
      city: "Toronto",
      serviceRadiusKm: 25,
      website: "https://democonstruction.com",
      phone: "(416) 555-0123",
      verified: true,
      avgRating: 4.8,
      reviewCount: 32,
      completedJobs: 27,
      categories: [
        "Bathroom Renovation",
        "Kitchen Renovation",
        "Basement Finishing",
        "General Contracting"
      ],
      serviceAreas: [
        "Toronto",
        "Mississauga",
        "Vaughan",
        "Markham",
        "Brampton"
      ]
    };
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={20}
        className={`${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-300 text-gray-300"
        }`}
      />
    ));
  };

  const handleContact = () => {
    if (authUser?.role === "homeowner") {
      router.push(`/messages`);
    } else {
      router.push("/");
    }
  };

  if (authLoading || isLoading) {
    return <LoadingState />;
  }

  if (error && !contractor) {
    return (
      <div className="min-h-screen bg-gray-50 pt-12" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px) + 8px)' }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => router.back()}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!contractor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-12" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px) + 8px)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Cover/Header Section */}
          <div className="bg-gradient-to-r from-rose-600 to-orange-600 h-32 sm:h-40"></div>
          
          {/* Profile Info */}
          <div className="px-6 sm:px-8 pb-8">
            <div className="relative">
              {/* Profile Photo */}
              <div className="absolute -top-16 sm:-top-20">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                  {contractor.profilePhoto ? (
                    <img
                      src={contractor.profilePhoto}
                      alt={contractor.companyName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Briefcase size={48} className="text-gray-400" />
                  )}
                </div>
              </div>

              <div className="pt-12 sm:pt-16">
                {/* Company Name & Verification */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {contractor.companyName}
                      </h1>
                      <VerifiedBadge verified={contractor.verified} size="lg" />
                    </div>
                    <p className="text-lg text-gray-600 capitalize">{contractor.trade}</p>
                  </div>
                  
                  <div className="flex gap-3 flex-wrap">
                    {authUser?.role === 'homeowner' ? (
                      <button
                        onClick={handleContact}
                        className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                      >
                        <MessageCircle size={20} />
                        <span>Get a Quote</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleContact}
                        className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                      >
                        <MessageCircle size={20} />
                        <span>Contact</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Trust Signals */}
                <div className="flex flex-wrap gap-4 sm:gap-6 mb-6 text-sm sm:text-base">
                  {contractor.verified && (
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle2 size={20} />
                      <span className="font-medium">Verified Contractor</span>
                    </div>
                  )}
                  {contractor.avgRating > 0 && (
                    <div className="flex items-center gap-2 text-yellow-600">
                      <Star size={20} className="fill-yellow-400" />
                      <span className="font-medium">
                        {contractor.avgRating.toFixed(1)} Average Rating
                      </span>
                    </div>
                  )}
                  {contractor.completedJobs > 0 && (
                    <div className="flex items-center gap-2 text-blue-700">
                      <Award size={20} />
                      <span className="font-medium">
                        {contractor.completedJobs} Completed Jobs
                      </span>
                    </div>
                  )}
                  {contractor.responseTimeLabel && (
                    <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                      <span className="text-lg">⚡</span>
                      <span className="font-medium">
                        Responds in {contractor.responseTimeLabel}
                      </span>
                    </div>
                  )}
                </div>

                {/* Rating Display */}
                {contractor.avgRating > 0 && (
                  <div className="flex items-center gap-3 mb-6 py-4 px-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-1">
                      {renderStars(contractor.avgRating)}
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      {contractor.avgRating.toFixed(1)}
                    </span>
                    <span className="text-gray-600">
                      ({contractor.reviewCount} review{contractor.reviewCount !== 1 ? 's' : ''})
                    </span>
                  </div>
                )}

                {/* Contact Info */}
                <div className="flex flex-wrap gap-4 sm:gap-6 text-sm text-gray-600 mb-6">
                  {contractor.city && (
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-gray-400" />
                      <span>{contractor.city}</span>
                    </div>
                  )}
                  {contractor.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={18} className="text-gray-400" />
                      <a href={`tel:${contractor.phone}`} className="hover:text-rose-600 transition-colors">
                        {contractor.phone}
                      </a>
                    </div>
                  )}
                  {contractor.website && (
                    <div className="flex items-center gap-2">
                      <Globe size={18} className="text-gray-400" />
                      <a
                        href={contractor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-rose-600 transition-colors"
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            {contractor.bio && (
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">{contractor.bio}</p>
              </div>
            )}

            {/* Recent Work Section */}
            {contractor.portfolio && contractor.portfolio.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Work</h2>
                <div className="space-y-5">
                  {contractor.portfolio.map((item: any) => (
                    <div key={item.id} className="rounded-xl border border-gray-100 overflow-hidden">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full object-cover max-h-72"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      )}
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full capitalize">{item.projectType}</span>
                          <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-base leading-snug">{item.title}</h3>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{item.description}</p>
                        )}
                        <div className="mt-2">
                          <PortfolioLikeButton itemId={item.id} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
              <ReviewsList contractorId={contractorId} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Services Section */}
            {contractor.categories && contractor.categories.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Services</h3>
                <div className="space-y-2">
                  {contractor.categories.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-gray-700 bg-gray-50 rounded-lg px-3 py-2"
                    >
                      <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                      <span className="text-sm">{category}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Service Areas */}
            {contractor.serviceAreas && contractor.serviceAreas.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Service Areas</h3>
                <div className="space-y-2">
                  {contractor.serviceAreas.map((area, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <MapPin size={16} className="text-rose-600 flex-shrink-0" />
                      <span className="text-sm">{area}</span>
                    </div>
                  ))}
                </div>
                {contractor.serviceRadiusKm && (
                  <p className="text-xs text-gray-500 mt-4">
                    Service radius: {contractor.serviceRadiusKm} km
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
