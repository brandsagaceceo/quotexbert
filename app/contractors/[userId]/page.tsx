"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  User, MapPin, Phone, Globe, Mail, Star, Award, Camera, 
  Briefcase, DollarSign, MessageCircle, ArrowLeft 
} from "lucide-react";
import ActivityTimeline from "@/components/ActivityTimeline";

interface PublicProfile {
  id: string;
  name?: string;
  email: string;
  role: string;
  companyName?: string;
  trade?: string;
  bio?: string;
  city?: string;
  phone?: string;
  website?: string;
  profilePhoto?: string;
  coverPhoto?: string;
  verified?: boolean;
  avgRating?: number;
  reviewCount?: number;
  completedJobs?: number;
  serviceRadiusKm?: number;
}

interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  projectType: string;
  projectCost?: string;
  duration?: string;
}

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchPublicProfile();
    }
  }, [userId]);

  const fetchPublicProfile = async () => {
    try {
      const response = await fetch(`/api/profile/public/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        setPortfolio(data.portfolio || []);
      } else if (response.status === 404) {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error fetching public profile:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-rose-600 border-t-transparent"></div>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Profile Not Found</h1>
          <p className="text-lg text-slate-600 mb-6">This profile doesn't exist or is not public.</p>
          <Link 
            href="/"
            className="bg-gradient-to-r from-rose-600 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const displayName = profile.companyName || profile.name || profile.email;
  const isContractor = profile.role === 'contractor';

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-slate-50">
      {/* Cover Photo Section */}
      <div className="relative h-64 md:h-80 mb-8 overflow-visible" style={{ marginTop: 'var(--header-height, 96px)' }}>
        <div className="absolute inset-0 overflow-hidden">
          {profile.coverPhoto ? (
            <img src={profile.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-rose-700 via-orange-600 to-red-700">
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              }}></div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"></div>
        </div>

        {/* Profile Info Container */}
        <div className="absolute -bottom-16 left-0 right-0">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              {/* Profile Picture */}
              <div className="relative flex-shrink-0">
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-br from-rose-100 to-orange-100">
                  {profile.profilePhoto ? (
                    <img src={profile.profilePhoto} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-700 to-orange-600">
                      <User className="h-20 w-20 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 pb-6">
                <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-slate-200">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 break-words">{displayName}</h1>
                    <p className="text-rose-900 font-semibold text-lg capitalize mb-3">
                      {profile.trade || profile.role}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-slate-600">
                      {profile.city && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-5 w-5 text-rose-700 flex-shrink-0" />
                          <span className="text-base">{profile.city}</span>
                        </div>
                      )}
                      {isContractor && profile.verified && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Award className="h-5 w-5" />
                          <span className="font-medium text-base">Verified Contractor</span>
                        </div>
                      )}
                      {profile.avgRating && profile.avgRating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                          <span className="font-bold text-base">{profile.avgRating.toFixed(1)}</span>
                          <span className="text-slate-500 text-base">({profile.reviewCount} reviews)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-24 md:h-20"></div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About</h2>
              <p className="text-base text-slate-700 leading-relaxed">
                {profile.bio || `${displayName} is ${isContractor ? 'a professional contractor' : 'a homeowner'} on QuotexBert.`}
              </p>
            </div>

            {/* Stats */}
            {isContractor && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <Briefcase className="h-8 w-8 text-rose-700 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gray-900">{profile.completedJobs || 0}</div>
                  <div className="text-base text-gray-600">Completed Jobs</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gray-900">{profile.avgRating?.toFixed(1) || '0.0'}</div>
                  <div className="text-base text-gray-600">Average Rating</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gray-900">{profile.serviceRadiusKm || 25}</div>
                  <div className="text-base text-gray-600">Service Radius (km)</div>
                </div>
              </div>
            )}

            {/* Portfolio */}
            {isContractor && portfolio.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Portfolio</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {portfolio.map(item => (
                    <div key={item.id} className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
                      )}
                      <div className="p-5">
                        <h3 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
                        <p className="text-base text-slate-600 mb-3">{item.description}</p>
                        {item.projectCost && (
                          <div className="flex items-center gap-1 text-green-600 font-semibold">
                            <DollarSign className="h-4 w-4" />
                            <span className="text-base">{item.projectCost}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Timeline */}
            <ActivityTimeline userId={userId} isContractor={isContractor} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Contact</h3>
              <div className="space-y-3">
                {profile.phone && (
                  <a href={`tel:${profile.phone}`} className="flex items-center gap-3 text-slate-700 hover:text-rose-700 transition-colors">
                    <Phone className="h-5 w-5" />
                    <span className="text-base">{profile.phone}</span>
                  </a>
                )}
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-3 text-slate-700 hover:text-rose-700 transition-colors">
                    <Mail className="h-5 w-5" />
                    <span className="text-base break-all">{profile.email}</span>
                  </a>
                )}
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-700 hover:text-rose-700 transition-colors">
                    <Globe className="h-5 w-5" />
                    <span className="text-base">Website</span>
                  </a>
                )}
              </div>

              {/* Message Button */}
              <Link
                href={`/messages?userId=${userId}`}
                className="mt-6 w-full bg-gradient-to-r from-rose-600 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                Send Message
              </Link>
            </div>

            {/* Location */}
            {profile.city && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Location</h3>
                <div className="flex items-center text-gray-700">
                  <MapPin className="h-5 w-5 mr-2 text-rose-700" />
                  <span className="text-base">{profile.city}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
