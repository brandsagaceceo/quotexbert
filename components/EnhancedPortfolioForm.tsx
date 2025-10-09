"use client";

import { useState } from "react";
import PhotoUpload from "@/components/PhotoUpload";

interface EnhancedPortfolioFormProps {
  onSubmit: (portfolioData: {
    title: string;
    caption: string;
    projectType: string;
    beforeImages: string[];
    afterImages: string[];
  }) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

const PROJECT_TYPES = [
  { value: "kitchen", label: "Kitchen Renovation" },
  { value: "bathroom", label: "Bathroom Renovation" },
  { value: "electrical", label: "Electrical Work" },
  { value: "plumbing", label: "Plumbing" },
  { value: "flooring", label: "Flooring" },
  { value: "painting", label: "Painting" },
  { value: "roofing", label: "Roofing" },
  { value: "hvac", label: "HVAC" },
  { value: "landscaping", label: "Landscaping" },
  { value: "general", label: "General Contracting" },
  { value: "handyman", label: "Handyman Services" },
  { value: "other", label: "Other" }
];

export default function EnhancedPortfolioForm({ 
  onSubmit, 
  isSubmitting, 
  onCancel 
}: EnhancedPortfolioFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    caption: "",
    projectType: "general"
  });
  const [beforeImages, setBeforeImages] = useState<string[]>([]);
  const [afterImages, setAfterImages] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Project title is required");
      return;
    }

    if (beforeImages.length === 0 && afterImages.length === 0) {
      setError("Please upload at least one before or after photo");
      return;
    }

    try {
      await onSubmit({
        ...formData,
        beforeImages,
        afterImages
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save portfolio item");
    }
  };

  return (
    <div className="bg-gray-700 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-6">Add Portfolio Project</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
            Project Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-burgundy-500 focus:ring-1 focus:ring-burgundy-500"
            placeholder="e.g., Modern Kitchen Transformation, Master Bathroom Remodel"
          />
        </div>

        {/* Project Type */}
        <div>
          <label htmlFor="projectType" className="block text-sm font-medium text-gray-300 mb-2">
            Project Type
          </label>
          <select
            id="projectType"
            value={formData.projectType}
            onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
            className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white focus:border-burgundy-500 focus:ring-1 focus:ring-burgundy-500"
          >
            {PROJECT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="caption" className="block text-sm font-medium text-gray-300 mb-2">
            Project Description
          </label>
          <textarea
            id="caption"
            value={formData.caption}
            onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
            rows={3}
            className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-burgundy-500 focus:ring-1 focus:ring-burgundy-500"
            placeholder="Describe the project scope, materials used, challenges overcome, and key features..."
          />
        </div>

        {/* Before Photos */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Before Photos
          </label>
          <PhotoUpload
            photos={beforeImages}
            onPhotosChange={setBeforeImages}
            maxPhotos={6}
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-400 mt-1">
            Show the condition before your work began
          </p>
        </div>

        {/* After Photos */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            After Photos
          </label>
          <PhotoUpload
            photos={afterImages}
            onPhotosChange={setAfterImages}
            maxPhotos={6}
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-400 mt-1">
            Showcase your completed work and craftsmanship
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-burgundy-600 to-teal-600 hover:from-burgundy-700 hover:to-teal-700 disabled:opacity-50 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            {isSubmitting ? "Adding to Portfolio..." : "Add to Portfolio"}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}