"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

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
}

const TRADES = [
  "general",
  "plumbing",
  "electrical",
  "hvac",
  "roofing",
  "flooring",
  "painting",
  "landscaping",
  "carpentry",
  "drywall",
  "kitchen",
  "bathroom",
  "windows",
  "siding",
  "concrete",
];

export default function ProfileEditorPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  const [profile, setProfile] = useState<ContractorProfile | null>(null);
  const [formData, setFormData] = useState({
    companyName: "",
    trade: "",
    bio: "",
    city: "",
    serviceRadiusKm: 25,
    website: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      // Check if user is a contractor
      const role = user.publicMetadata?.role;
      if (role !== "contractor") {
        router.push("/");
        return;
      }

      fetchProfile();
    }
  }, [isLoaded, user, router]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/contractors/profile?userId=${user?.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        setFormData({
          companyName: data.profile.companyName || "",
          trade: data.profile.trade || "",
          bio: data.profile.bio || "",
          city: data.profile.city || "",
          serviceRadiusKm: data.profile.serviceRadiusKm || 25,
          website: data.profile.website || "",
          phone: data.profile.phone || "",
        });
      } else {
        // Profile doesn't exist yet, start with empty form
        setProfile(null);
      }
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "serviceRadiusKm" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/contractors/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save profile");
      }

      const data = await response.json();
      setProfile(data.profile);
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="bg-gray-800 rounded-lg p-8">
              <div className="h-8 bg-gray-700 rounded w-1/3 mb-8"></div>
              <div className="space-y-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-700 rounded w-full"></div>
                  </div>
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
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gray-800 rounded-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Contractor Profile</h1>
            {profile?.verified && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                ✓ Verified
              </span>
            )}
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-900/20 border border-green-500 rounded-lg p-4 mb-6">
              <p className="text-green-400">Profile saved successfully!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Your company or business name"
              />
            </div>

            {/* Trade */}
            <div>
              <label htmlFor="trade" className="block text-sm font-medium text-gray-300 mb-2">
                Trade/Specialty *
              </label>
              <select
                id="trade"
                name="trade"
                value={formData.trade}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select your trade</option>
                {TRADES.map(trade => (
                  <option key={trade} value={trade}>
                    {trade.charAt(0).toUpperCase() + trade.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
                Bio/Description
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Tell potential clients about your experience, specialties, and what sets you apart..."
              />
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
                  City/Location
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Your primary service city"
                />
              </div>

              <div>
                <label htmlFor="serviceRadiusKm" className="block text-sm font-medium text-gray-300 mb-2">
                  Service Radius (km)
                </label>
                <input
                  type="number"
                  id="serviceRadiusKm"
                  name="serviceRadiusKm"
                  value={formData.serviceRadiusKm}
                  onChange={handleInputChange}
                  min="1"
                  max="500"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Your business phone number"
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="https://your-website.com"
                />
              </div>
            </div>

            {/* Rating Display */}
            {profile && (
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Your Rating</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < Math.floor(profile.avgRating) ? "text-yellow-400" : "text-gray-600"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-lg font-bold text-white">
                      {profile.avgRating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-gray-400">
                    ({profile.reviewCount} review{profile.reviewCount !== 1 ? 's' : ''})
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>

              {profile && (
                <a
                  href={`/contractors/${user?.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  View Public Profile
                </a>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
