"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";

interface ContractorProfile {
  id: string;
  userId: string;
  companyName: string;
  trade: string;
  bio?: string;
  city?: string;
  phone?: string;
  website?: string;
  verified: boolean;
  avgRating: number;
  reviewCount: number;
  createdAt: string;
  user: {
    email: string;
    createdAt: string;
  };
}

export default function AdminVerificationPage() {
  const { authUser: user, authLoading } = useAuth();
  const router = useRouter();
  
  const [contractors, setContractors] = useState<ContractorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "verified" | "unverified">("all");

  useEffect(() => {
    if (!authLoading && user) {
      // Check if user is a contractor (or admin role in future)
      const role = user.role;
      if (role !== "contractor") {
        router.push("/");
        return;
      }

      fetchContractors();
    }
  }, [authLoading, user, router]);

  const fetchContractors = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/contractors");
      
      if (!response.ok) {
        throw new Error("Failed to fetch contractors");
      }
      
      const data = await response.json();
      setContractors(data.contractors || []);
    } catch (err) {
      setError("Failed to load contractors");
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async (contractorId: string, currentStatus: boolean) => {
    setUpdating(contractorId);
    setError(null);

    try {
      const response = await fetch("/api/admin/contractors/verify", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractorId,
          verified: !currentStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update verification");
      }

      // Update local state
      setContractors(prev =>
        prev.map(contractor =>
          contractor.id === contractorId
            ? { ...contractor, verified: !currentStatus }
            : contractor
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update verification");
    } finally {
      setUpdating(null);
    }
  };

  const filteredContractors = contractors.filter(contractor => {
    if (filter === "verified") return contractor.verified;
    if (filter === "unverified") return !contractor.verified;
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < Math.floor(rating) ? "text-yellow-400" : "text-gray-600"
        }`}
      >
        ★
      </span>
    ));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="bg-gray-800 rounded-lg p-8">
              <div className="h-8 bg-gray-700 rounded w-1/3 mb-8"></div>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-24 bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gray-800 rounded-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Contractor Verification</h1>
            
            <div className="flex items-center gap-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Contractors</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified Only</option>
              </select>
              
              <button
                onClick={fetchContractors}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Total Contractors</h3>
              <p className="text-3xl font-bold text-blue-400">{contractors.length}</p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Verified</h3>
              <p className="text-3xl font-bold text-green-400">
                {contractors.filter(c => c.verified).length}
              </p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Pending Verification</h3>
              <p className="text-3xl font-bold text-yellow-400">
                {contractors.filter(c => !c.verified).length}
              </p>
            </div>
          </div>

          {/* Contractors List */}
          {filteredContractors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                {filter === "all" 
                  ? "No contractors found" 
                  : `No ${filter} contractors found`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContractors.map((contractor) => (
                <div
                  key={contractor.id}
                  className="bg-gray-700 rounded-lg p-6 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-xl font-semibold text-white">
                        {contractor.companyName}
                      </h3>
                      
                      {contractor.verified ? (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                          ⏳ Pending
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-300">
                      <div>
                        <span className="font-medium">Email:</span> {contractor.user.email}
                      </div>
                      <div>
                        <span className="font-medium">Trade:</span> {contractor.trade}
                      </div>
                      {contractor.city && (
                        <div>
                          <span className="font-medium">City:</span> {contractor.city}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Joined:</span> {formatDate(contractor.createdAt)}
                      </div>
                    </div>
                    
                    {contractor.phone && (
                      <div className="text-sm text-gray-300 mt-2">
                        <span className="font-medium">Phone:</span> {contractor.phone}
                      </div>
                    )}
                    
                    {contractor.website && (
                      <div className="text-sm text-gray-300 mt-1">
                        <span className="font-medium">Website:</span>{" "}
                        <a
                          href={contractor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {contractor.website}
                        </a>
                      </div>
                    )}
                    
                    {contractor.bio && (
                      <div className="text-sm text-gray-300 mt-2">
                        <span className="font-medium">Bio:</span> {contractor.bio}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        {renderStars(contractor.avgRating)}
                        <span className="text-sm font-medium text-white">
                          {contractor.avgRating.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-400">
                          ({contractor.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 ml-6">
                    <button
                      onClick={() => toggleVerification(contractor.id, contractor.verified)}
                      disabled={updating === contractor.id}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        contractor.verified
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      } disabled:opacity-50`}
                    >
                      {updating === contractor.id
                        ? "Updating..."
                        : contractor.verified
                        ? "Remove Verification"
                        : "Verify Contractor"
                      }
                    </button>
                    
                    <a
                      href={`/contractors/${contractor.userId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors text-center"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
