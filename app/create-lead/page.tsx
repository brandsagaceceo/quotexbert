"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PhotoUpload from "@/components/PhotoUpload";
import { submitLead } from "@/app/actions/submitLead";
import { CATEGORY_GROUPS } from "@/lib/categories";

export default function CreateLeadPage() {
  const { authUser: user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    zipCode: ""
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Function to determine category from description
  const detectCategoryFromDescription = (description: string): string => {
    const desc = description.toLowerCase();
    
    // Kitchen categories
    if (desc.includes('kitchen')) return 'kitchen-renovation';
    if (desc.includes('cabinets') || desc.includes('millwork')) return 'cabinets-millwork';
    if (desc.includes('countertop')) return 'countertops-installation';
    
    // Bathroom categories
    if (desc.includes('bathroom') || desc.includes('shower') || desc.includes('toilet')) return 'bathroom-renovation';
    
    // Plumbing and water
    if (desc.includes('plumb') || desc.includes('pipe') || desc.includes('water') || desc.includes('drain')) return 'electrical-general';
    
    // Electrical
    if (desc.includes('electric') || desc.includes('wiring') || desc.includes('outlet') || desc.includes('lighting')) return 'electrical-general';
    if (desc.includes('smart home') || desc.includes('security')) return 'smart-home-installation';
    
    // Flooring
    if (desc.includes('floor') || desc.includes('carpet') || desc.includes('tile') || desc.includes('hardwood')) return 'flooring-installation-repair';
    
    // Painting
    if (desc.includes('paint') || desc.includes('wall') || desc.includes('interior') || desc.includes('exterior')) return 'painting-interior-exterior';
    
    // Roofing
    if (desc.includes('roof') || desc.includes('gutter') || desc.includes('siding')) return 'roofing';
    
    // HVAC
    if (desc.includes('hvac') || desc.includes('heating') || desc.includes('cooling') || desc.includes('air') || desc.includes('furnace')) return 'heating-cooling-hvac';
    
    // Landscaping
    if (desc.includes('landscape') || desc.includes('garden') || desc.includes('yard') || desc.includes('lawn')) return 'landscaping-garden-design';
    
    // Handyman
    if (desc.includes('handyman') || desc.includes('repair') || desc.includes('fix') || desc.includes('mount')) return 'handyman-services';
    
    // Cleaning
    if (desc.includes('clean') || desc.includes('wash') || desc.includes('maintenance')) return 'deep-cleaning';
    
    // Default to handyman for general work
    return 'handyman-services';
  };

  // Load estimate data on component mount
  useEffect(() => {
    const estimateData = localStorage.getItem('estimate_data');
    const estimatePhotos = localStorage.getItem('estimate_photos');
    
    if (estimateData) {
      try {
        const estimate = JSON.parse(estimateData);
        console.log('Loading estimate data:', estimate);
        
        // Pre-fill form with estimate data
        if (estimate.projectDescription) {
          const detectedCategory = detectCategoryFromDescription(estimate.projectDescription);
          
          setFormData(prev => ({
            ...prev,
            title: estimate.projectDescription.length > 50 
              ? estimate.projectDescription.substring(0, 50) + '...'
              : estimate.projectDescription,
            description: estimate.projectDescription,
            category: detectedCategory,
            budget: estimate.min && estimate.max 
              ? `$${estimate.min.toLocaleString()} - $${estimate.max.toLocaleString()}`
              : ""
          }));
        }
        
        // Load photos if available
        if (estimatePhotos) {
          try {
            const photosArray = JSON.parse(estimatePhotos);
            console.log('Loading photos:', photosArray.length);
            // Keep photos in base64 format - they'll be converted during submission
            setPhotos(photosArray);
          } catch (photoError) {
            console.error('Error loading photos:', photoError);
          }
        }
        
        // Clear the estimate data from localStorage after loading
        localStorage.removeItem('estimate_data');
      } catch (error) {
        console.error('Error loading estimate data:', error);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError("You must be signed in to create a lead");
      return;
    }

    if (user.role !== "homeowner") {
      setError("Only homeowners can create leads");
      return;
    }

    // Validate required fields
    if (!formData.title || !formData.category || !formData.description || !formData.zipCode) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const submitFormData = new FormData();
      submitFormData.append("postalCode", formData.zipCode);
      submitFormData.append("projectType", formData.category);
      submitFormData.append("title", formData.title);
      submitFormData.append("description", formData.description);
      submitFormData.append("budget", formData.budget);
      submitFormData.append("photos", JSON.stringify(photos));
      submitFormData.append("website", ""); // Honeypot field

      const result = await submitLead(submitFormData);
      
      if (result.success) {
        // Redirect to the job board or homeowner jobs page to see the posted job
        router.push(`/homeowner/jobs`);
      } else {
        console.error("Lead submission failed:", result);
        setError(result.error || "Failed to create lead");
      }
    } catch (error) {
      console.error("Error creating lead:", error);
      setError(`An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-slate-50 to-red-50 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-4">Sign In Required</h1>
          <p className="text-center mb-6">You need to sign in to create a lead.</p>
          <div className="text-center">
            <a href="/sign-in" className="block bg-gradient-to-r from-burgundy-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold">
              Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== "homeowner") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-slate-50 to-red-50 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-4">Homeowner Access Only</h1>
          <p className="text-center mb-6">Only homeowners can create project leads.</p>
          <div className="text-center">
            <Link href="/" className="bg-gradient-to-r from-burgundy-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-slate-50 to-red-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-burgundy-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Create Your Project
          </h1>
          <p className="text-xl text-gray-600">
            Tell contractors about your project and get matched with qualified professionals
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Project Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Kitchen Cabinet Installation"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Project Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200"
                required
              >
                <option value="">Select a category</option>
                {CATEGORY_GROUPS.map((group) => (
                  <optgroup key={group.id} label={group.name}>
                    {group.categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Project Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your project in detail. Include specifics about what work needs to be done, materials, timeline, etc."
                rows={6}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200"
                required
              />
            </div>

            {/* Budget */}
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Budget (CAD)
              </label>
              <input
                type="text"
                id="budget"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="$5,000 - $10,000"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200"
                required
              />
            </div>

            {/* Postal Code */}
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code
              </label>
              <input
                type="text"
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value.toUpperCase() })}
                placeholder="K1A 0A6"
                pattern="[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-burgundy-500 focus:ring-2 focus:ring-burgundy-200"
                required
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Photos
              </label>
              <PhotoUpload
                photos={photos}
                onPhotosChange={setPhotos}
                maxPhotos={8}
                disabled={isSubmitting}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-burgundy-600 to-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-burgundy-700 hover:to-teal-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Creating Lead..." : "Create Lead"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}