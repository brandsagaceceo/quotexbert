"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
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
  completedJobs?: number;
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
      // For demo purposes, create sample contractor data
      const sampleContractors: ContractorProfile[] = [
        {
          id: "contractor-1",
          userId: "demo-contractor",
          companyName: "Demo Construction Co.",
          trade: "General Contractor",
          bio: "Professional construction company with 15+ years of experience in residential renovations.",
          city: "Toronto",
          serviceRadiusKm: 25,
          website: "https://democonstruction.com",
          phone: "(416) 555-0123",
          verified: true,
          avgRating: 4.8,
          reviewCount: 24,
          completedJobs: 156
        },
        {
          id: "contractor-2",
          userId: "contractor-2",
          companyName: "Elite Kitchen Design",
          trade: "Kitchen Specialist",
          bio: "Specializing in modern kitchen renovations and custom cabinetry.",
          city: "Mississauga",
          serviceRadiusKm: 30,
          phone: "(905) 555-0456",
          verified: true,
          avgRating: 4.9,
          reviewCount: 18,
          completedJobs: 89
        },
        {
          id: "contractor-3",
          userId: "contractor-3",
          companyName: "Perfect Plumbing Pro",
          trade: "Plumbing",
          bio: "Licensed plumber serving the GTA. Emergency services available 24/7.",
          city: "North York",
          serviceRadiusKm: 35,
          phone: "(647) 555-0789",
          verified: true,
          avgRating: 4.7,
          reviewCount: 31,
          completedJobs: 203
        },
        {
          id: "contractor-4",
          userId: "contractor-4",
          companyName: "Spark Electric Solutions",
          trade: "Electrical",
          bio: "Certified electricians providing safe and reliable electrical services.",
          city: "Scarborough",
          serviceRadiusKm: 20,
          verified: false,
          avgRating: 4.5,
          reviewCount: 12,
          completedJobs: 67
        },
        {
          id: "contractor-5",
          userId: "contractor-5",
          companyName: "Artisan Painters",
          trade: "Painting",
          bio: "Interior and exterior painting specialists with attention to detail.",
          city: "Etobicoke",
          serviceRadiusKm: 40,
          verified: true,
          avgRating: 4.6,
          reviewCount: 28,
          completedJobs: 134
        }
      ];

      setContractors(sampleContractors);
    } catch (error) {
      console.error("Error fetching contractors:", error);
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-700"></div>
      </div>
    );
  }

  if (!isSignedIn || !authUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
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
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
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
            <div className={`bg-white rounded-lg shadow-md p-4 md:p-6 ${showFilters ? 'block' : 'hidden'} lg:block lg:sticky lg:top-6`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden text-rose-700 hover:text-rose-900"
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
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="text-rose-700 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Verified only</span>
                  </label>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full text-sm text-rose-700 hover:text-rose-900 font-medium"
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
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No contractors found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                {filteredContractors.map((contractor) => (
                  <div key={contractor.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="p-4 md:p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3 md:space-x-4 flex-1">
                          <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            {contractor.profilePhoto ? (
                              <img 
                                src={contractor.profilePhoto} 
                                alt={contractor.companyName}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <User className="h-6 w-6 md:h-8 md:w-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-base md:text-lg font-bold text-gray-900 truncate">{contractor.companyName}</h3>
                              {contractor.verified && (
                                <Award className="h-4 w-4 md:h-5 md:w-5 text-green-600 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-rose-700 font-medium text-sm md:text-base">{contractor.trade}</p>
                            {contractor.city && (
                              <div className="flex items-center text-gray-600 text-xs md:text-sm mt-1">
                                <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1 flex-shrink-0" />
                                <span className="truncate">{contractor.city} • {contractor.serviceRadiusKm}km radius</span>
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
                          className="flex-1 bg-rose-700 text-white py-3 px-4 rounded-lg hover:bg-rose-800 flex items-center justify-center text-sm md:text-base font-medium"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contact
                        </button>
                        <button className="flex-1 sm:flex-none px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm md:text-base font-medium">
                          View Profile
                        </button>
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