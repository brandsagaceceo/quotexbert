"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ToastProvider";
import {
  X,
  Save,
  Upload,
  User,
  MapPin,
  Phone,
  Home,
  DollarSign,
  Tag
} from "lucide-react";
import Image from "next/image";

interface HomeownerProfileData {
  name?: string;
  city?: string;
  phone?: string;
  profilePhoto?: string;
  bio?: string;
  homeType?: string;
  preferredRenovationTypes: string[];
  budgetRange?: string;
}

interface EditHomeownerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: HomeownerProfileData;
  onSave: (data: HomeownerProfileData) => Promise<void>;
}

const HOME_TYPES = ["house", "condo", "townhouse", "apartment"];

const RENOVATION_TYPES = [
  "Kitchen Renovation",
  "Bathroom Renovation",
  "Basement Finishing",
  "Flooring",
  "Painting",
  "Roofing",
  "Windows & Doors",
  "Landscaping",
  "Electrical",
  "Plumbing",
  "HVAC",
  "General Contracting"
];

const BUDGET_RANGES = [
  "Under $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000 - $50,000",
  "$50,000 - $100,000",
  "Over $100,000"
];

export default function EditHomeownerProfileModal({
  isOpen,
  onClose,
  profileData,
  onSave
}: EditHomeownerProfileModalProps) {
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<HomeownerProfileData>(profileData);

  useEffect(() => {
    setFormData(profileData);
  }, [profileData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSaving(true);
    try {
      await onSave(formData);
      toast.success("Profile updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleRenovationType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      preferredRenovationTypes: prev.preferredRenovationTypes.includes(type)
        ? prev.preferredRenovationTypes.filter(t => t !== type)
        : [...prev.preferredRenovationTypes, type]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4 py-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90dvh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
            <p className="text-gray-600 mt-1">Update your homeowner profile information</p>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Profile Photo */}
          {formData.profilePhoto && (
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                <Image
                  src={formData.profilePhoto}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-gray-900">Profile Photo</p>
                <p className="text-sm text-gray-500">Update your profile picture</p>
              </div>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Name
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              City
            </label>
            <input
              type="text"
              value={formData.city || ""}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="e.g., Toronto"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone || ""}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(555) 123-4567"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              About You
            </label>
            <textarea
              value={formData.bio || ""}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell contractors about your renovation goals..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Home Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Home className="w-4 h-4 inline mr-1" />
              Home Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {HOME_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, homeType: type })}
                  className={`px-4 py-3 rounded-lg border-2 transition-all font-medium capitalize ${
                    formData.homeType === type
                      ? "border-rose-500 bg-rose-50 text-rose-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Typical Budget Range
            </label>
            <select
              value={formData.budgetRange || ""}
              onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              <option value="">Select a budget range</option>
              {BUDGET_RANGES.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>

          {/* Preferred Renovation Types */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Tag className="w-4 h-4 inline mr-1" />
              Renovation Interests
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Select the types of renovations you're interested in
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {RENOVATION_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleRenovationType(type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    formData.preferredRenovationTypes.includes(type)
                      ? "bg-rose-100 text-rose-700 border-2 border-rose-500"
                      : "bg-gray-100 text-gray-700 border-2 border-transparent hover:border-gray-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-lg hover:from-rose-700 hover:to-orange-700 transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}
