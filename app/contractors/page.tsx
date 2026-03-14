"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import {
  Search,
  MapPin,
  Star,
  Award,
  Filter,
  User,
  Phone,
  Globe,
  MessageCircle
} from "lucide-react";

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
  portfolio?: any[];
  completedJobs: number;
  responseTimeLabel?: string;
}

export default function ContractorSearchPage() {
  const { isSignedIn, authUser, authLoading } = useAuth();
  const router = useRouter();
  const [contractors, setContractors] = useState<ContractorProfile[]>([]);
  const [filteredContractors, setFilteredContractors] = useState<ContractorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    trade: "",
    city: "",
    minRating: 0,
    verified: false,
    maxRadius: 50
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isSignedIn || !authUser) {
      router.push("/sign-in");
      return;
    }
    fetchContractors();
  }, [isSignedIn, authUser, authLoading, router]);

  useEffect(() => {
    applyFilters();
  }, [contractors, searchTerm, filters]);

  const fetchContractors = async () => {
    try {
      const res = await fetch('/api/contractors/list');
      if (res.ok) {
        const data = await res.json();
        setContractors(data);
      }
    } catch (error) {
      console.error('Error fetching contractors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    // Apply filters
    const filtered = contractors.filter(contractor => {
      // Search term filter
      const matchesSearch = searchTerm === "" || 
        contractor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contractor.trade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contractor.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contractor.city?.toLowerCase().includes(searchTerm.toLowerCase());

      // Trade filter
      const matchesTrade = filters.trade === "" || contractor.trade === filters.trade;

      // City filter
      const matchesCity = filters.city === "" || contractor.city === filters.city;

      // Rating filter
      const matchesRating = contractor.avgRating >= filters.minRating;

      // Verified filter
      const matchesVerified = !filters.verified || contractor.verified;

      // Radius filter
      const matchesRadius = contractor.serviceRadiusKm <= filters.maxRadius;

      return matchesSearch && matchesTrade && matchesCity && matchesRating && matchesVerified && matchesRadius;
    });

    // Sort by rating and review count
    filtered.sort((a, b) => {
      if (a.verified && !b.verified) return -1;
      if (!a.verified && b.verified) return 1;
      if (b.avgRating !== a.avgRating) return b.avgRating - a.avgRating;
      return b.reviewCount - a.reviewCount;
    });

    setFilteredContractors(filtered);
  };

  const clearFilters = () => {
    setFilters({
      trade: "",
      city: "",
      minRating: 0,
      verified: false,
      maxRadius: 50
    });
    setSearchTerm("");
  };

  const handleContact = (contractor: ContractorProfile) => {
    // In a real app, this would start a conversation or open contact modal
    alert(`Contact feature would open for ${contractor.companyName}`);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand"></div>
      </div>
    );
  }

  if (!isSignedIn || !authUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-brand/10">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Find Contractors</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">Connect with verified professionals for your home improvement projects</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        {/* Mobile Search Bar */}
        <div className="md:hidden mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search contractors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 text-base"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className={`bg-white rounded-xl shadow-md border border-brand/10 p-4 md:p-6 ${showFilters ? 'block' : 'hidden'} lg:block lg:sticky lg:top-6`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden text-brand hover:text-brand-dark"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Search - Desktop only */}
                <div className="hidden lg:block">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Company name, trade, location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30"
                    />
                  </div>
                </div>

                {/* Trade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trade
                  </label>
                  <select
                    value={filters.trade}
                    onChange={(e) => setFilters(prev => ({ ...prev, trade: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30"
                  >
                    <option value="">All Trades</option>
                    <option value="General Contractor">General Contractor</option>
                    <option value="Kitchen Specialist">Kitchen Specialist</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Painting">Painting</option>
                    <option value="Flooring">Flooring</option>
                    <option value="Roofing">Roofing</option>
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <select
                    value={filters.city}
                    onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30"
                  >
                    <option value="">All Cities</option>
                    <option value="Toronto">Toronto</option>
                    <option value="Mississauga">Mississauga</option>
                    <option value="North York">North York</option>
                    <option value="Scarborough">Scarborough</option>
                    <option value="Etobicoke">Etobicoke</option>
                  </select>
                </div>

                {/* Minimum Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => setFilters(prev => ({ ...prev, minRating: Number(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30"
                  >
                    <option value={0}>Any Rating</option>
                    <option value={4}>4+ Stars</option>
                    <option value={4.5}>4.5+ Stars</option>
                    <option value={4.8}>4.8+ Stars</option>
                  </select>
                </div>

                {/* Service Radius */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Service Radius: {filters.maxRadius}km
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={filters.maxRadius}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxRadius: Number(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                {/* Verified Only */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.verified}
                      onChange={(e) => setFilters(prev => ({ ...prev, verified: e.target.checked }))}
                      className="text-brand focus:ring-brand/30 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Verified only</span>
                  </label>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full text-sm text-brand hover:text-brand-dark font-medium"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {filteredContractors.length} contractors found
              </h2>
            </div>

            {filteredContractors.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
                <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No contractors found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                {filteredContractors.map((contractor) => (
                  <div key={contractor.id} className="bg-white rounded-xl shadow-md hover:shadow-lg hover:border hover:border-brand/20 transition-all">
                    <div className="p-4 md:p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3 md:space-x-4 flex-1">
                          <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                            {contractor.profilePhoto ? (
                              <img 
                                src={contractor.profilePhoto} 
                                alt={contractor.companyName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="h-6 w-6 md:h-8 md:w-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base md:text-lg font-bold text-gray-900 truncate">{contractor.companyName}</h3>
                              <VerifiedBadge verified={contractor.verified} size="sm" />
                            </div>
                            <p className="text-brand font-medium text-sm md:text-base">{contractor.trade}</p>
                            {contractor.city && (
                              <div className="flex items-center text-gray-600 text-xs md:text-sm mt-1">
                                <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1 flex-shrink-0" />
                                <span className="truncate">{contractor.city} • {contractor.serviceRadiusKm}km radius</span>
                              </div>
                            )}
                            {contractor.responseTimeLabel && (
                              <div className="flex items-center gap-1 mt-2 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium w-fit">
                                <span>⚡</span>
                                <span>Responds in {contractor.responseTimeLabel}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-base md:text-lg font-bold text-gray-900">{contractor.avgRating}</div>
                          <div className="text-xs text-gray-600">Rating</div>
                        </div>
                        <div className="text-center">
                          <div className="text-base md:text-lg font-bold text-gray-900">{contractor.reviewCount}</div>
                          <div className="text-xs text-gray-600">Reviews</div>
                        </div>
                        <div className="text-center">
                          <div className="text-base md:text-lg font-bold text-gray-900">{contractor.completedJobs}</div>
                          <div className="text-xs text-gray-600">Jobs Done</div>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="mb-4">
                        {renderStars(contractor.avgRating)}
                      </div>

                      {/* Bio */}
                      {contractor.bio && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{contractor.bio}</p>
                      )}

                      {/* Contact Info */}
                      <div className="flex items-center space-x-4 text-xs md:text-sm text-gray-600 mb-4 overflow-x-auto">
                        {contractor.phone && (
                          <div className="flex items-center flex-shrink-0">
                            <Phone className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            <span className="hidden sm:inline">{contractor.phone}</span>
                            <span className="sm:hidden">Phone</span>
                          </div>
                        )}
                        {contractor.website && (
                          <div className="flex items-center flex-shrink-0">
                            <Globe className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            <span>Website</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <button
                          onClick={() => handleContact(contractor)}
                          className="flex-1 bg-brand text-white py-3 px-4 rounded-lg hover:bg-brand-dark flex items-center justify-center text-sm md:text-base font-medium"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contact
                        </button>
                        <Link
                          href={`/contractors/profile/${contractor.userId}`}
                          className="flex-1 sm:flex-none px-4 py-3 border border-brand/30 rounded-lg text-brand hover:bg-brand/5 text-sm md:text-base font-medium text-center"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}