"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PhotoUploadFixed from "@/components/PhotoUploadFixed";
import { submitLead } from "@/app/actions/submitLead";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { Sparkles, CheckCircle, AlertCircle } from "lucide-react";

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
  const [successMessage, setSuccessMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
        
        // Load and upload photos if available
        if (estimatePhotos) {
          try {
            const photosArray = JSON.parse(estimatePhotos);
            console.log('Loading photos from estimate:', photosArray.length);
            
            // Upload base64 photos to storage
            uploadBase64Photos(photosArray);
          } catch (photoError) {
            console.error('Error loading photos:', photoError);
          }
        }
        
        // Clear both estimate data AND photos from localStorage after loading
        localStorage.removeItem('estimate_data');
        localStorage.removeItem('estimate_photos');
      } catch (error) {
        console.error('Error loading estimate data:', error);
      }
    }
  }, []);

  // Function to upload base64 photos to storage
  const uploadBase64Photos = async (base64Photos: string[]) => {
    console.log('Uploading', base64Photos.length, 'base64 photos to storage...');
    
    try {
      const uploadPromises = base64Photos.map(async (base64, index) => {
        try {
          // Convert base64 to Blob
          const response = await fetch(base64);
          const blob = await response.blob();
          
          // Create File from Blob
          const file = new File([blob], `estimate-photo-${index + 1}.jpg`, { type: blob.type || 'image/jpeg' });
          
          // Upload to server
          const formData = new FormData();
          formData.append('photos', file);
          formData.append('type', 'leads');
          
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });
          
          if (!uploadResponse.ok) {
            console.error('Failed to upload photo', index + 1);
            return base64; // Fallback to base64 if upload fails
          }
          
          const result = await uploadResponse.json();
          const uploadedUrl = result.files?.[0] || result.url;
          
          console.log('Photo', index + 1, 'uploaded:', uploadedUrl);
          return uploadedUrl || base64;
        } catch (error) {
          console.error('Error uploading photo', index + 1, error);
          return base64; // Fallback to base64 if upload fails
        }
      });
      
      const uploadedUrls = await Promise.all(uploadPromises);
      console.log('All photos uploaded, setting photos state');
      setPhotos(uploadedUrls);
    } catch (error) {
      console.error('Error uploading base64 photos:', error);
      // Fallback: use base64 photos as-is
      setPhotos(base64Photos);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError("You must be signed in to create a lead");
      return;
    }

    // Clear previous errors
    setError("");
    setFieldErrors({});
    setSuccessMessage("");

    // Validate required fields
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = "Project title is required";
    if (!formData.category) errors.category = "Please select a category";
    if (!formData.description.trim()) errors.description = "Project description is required";
    if (!formData.zipCode.trim()) errors.zipCode = "Postal code is required";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const submitFormData = new FormData();
      submitFormData.append("title", formData.title);
      submitFormData.append("projectType", formData.category);
      submitFormData.append("description", formData.description);
      submitFormData.append("budget", formData.budget);
      submitFormData.append("postalCode", formData.zipCode);
      submitFormData.append("photos", JSON.stringify(photos));
      // Pass the user ID to ensure server action has it
      submitFormData.append("userId", user.id);
      
      const result = await submitLead(submitFormData);

      if (result.success) {
        setSuccessMessage("Your project has been posted successfully! Redirecting...");
        
        // Track Clarity event for successful lead creation
        if (typeof window !== 'undefined' && (window as any).clarity) {
          (window as any).clarity('event', 'lead_created_success', {
            hasPhotos: photos.length > 0,
            photoCount: photos.length,
            hasDescription: formData.description.length > 0,
            requestId: result.requestId
          });
        }
        
        // Clear form
        setFormData({
          title: "",
          description: "",
          category: "",
          budget: "",
          zipCode: ""
        });
        setPhotos([]);
        
        // Redirect after showing success message
        setTimeout(() => {
          router.push(`/profile`);
        }, 1500);
      } else {
        console.error("Lead submission failed:", result);
        
        // Track Clarity event for lead creation errors
        if (typeof window !== 'undefined' && (window as any).clarity) {
          (window as any).clarity('event', 'lead_creation_error', {
            errorCode: result.code || 'UNKNOWN',
            errorMessage: result.error,
            requestId: result.requestId,
            hasFieldErrors: !!(result.fieldErrors && Object.keys(result.fieldErrors).length > 0),
            fieldErrorCount: result.fieldErrors ? Object.keys(result.fieldErrors).length : 0
          });
        }
        
        // Handle field-specific errors
        let errorMessage: string;
        
        if (result.fieldErrors && Object.keys(result.fieldErrors).length > 0) {
          setFieldErrors(result.fieldErrors);
          
          // Build detailed error message from field errors
          const fieldErrorMessages = Object.entries(result.fieldErrors)
            .map(([field, msg]) => {
              const fieldName = field === 'postalCode' ? 'Postal Code' : 
                               field === 'projectType' ? 'Project Type' :
                               field.charAt(0).toUpperCase() + field.slice(1);
              return `${fieldName}: ${msg}`;
            })
            .join('; ');
          
          errorMessage = fieldErrorMessages;
        } else {
          errorMessage = result.error || "Failed to create lead. Please try again.";
        }
        
        // Display error message with requestId for support
        if (result.requestId) {
          errorMessage += `\n\nSave this ID for support: ${result.requestId}`;
        }
        
        setError(errorMessage);
        
        // Log to console for debugging
        if (process.env.NODE_ENV === 'development') {
          console.error('Lead creation failed:', {
            error: result.error,
            code: result.code,
            requestId: result.requestId,
            fieldErrors: result.fieldErrors
          });
        }
      }
    } catch (error) {
      console.error("Error creating lead:", error);
      
      // Provide helpful error messages
      if (error instanceof Error) {
        if (error.message.includes('authentication') || error.message.includes('sign in')) {
          setError("Session expired. Please refresh the page or sign in again.");
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          setError("Network error. Please check your connection and try again.");
        } else if (error.message.includes('clerk') || error.message.includes('user')) {
          setError("Authentication error. Please refresh the page and try again.");
        } else {
          setError(`Error: ${error.message}`);
        }
      } else {
        setError("An unexpected error occurred. Please refresh the page and try again.");
      }
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
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-orange-50 to-amber-50 pb-safe">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-rose-700 via-rose-600 to-orange-600 p-3 rounded-xl shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-rose-700 via-rose-600 to-orange-600 bg-clip-text text-transparent">
                Post Your Project
              </h1>
              <p className="text-sm sm:text-base text-rose-800 font-medium mt-1">
                Get matched with verified contractors
              </p>
            </div>
          </div>
          
          {/* Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-md border-2 border-rose-200">
              <CheckCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span className="text-sm font-semibold text-gray-800">100% Free to Post</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-md border-2 border-rose-200">
              <CheckCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span className="text-sm font-semibold text-gray-800">Verified Contractors</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-md border-2 border-rose-200">
              <CheckCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span className="text-sm font-semibold text-gray-800">Multiple Quotes</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl border-2 border-rose-200 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-800 mb-2">
                Project Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (fieldErrors.title) {
                    setFieldErrors(prev => ({ ...prev, title: "" }));
                  }
                }}
                placeholder="e.g., Kitchen Cabinet Installation"
                className={`w-full bg-gray-50 border rounded-xl p-3 sm:p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  fieldErrors.title 
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                    : "border-gray-200 focus:border-rose-500 focus:ring-rose-200"
                }`}
                required
                disabled={isSubmitting}
              />
              {fieldErrors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {fieldErrors.title}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-800 mb-2">
                Project Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value });
                  if (fieldErrors.category) {
                    setFieldErrors(prev => ({ ...prev, category: "" }));
                  }
                }}
                className={`w-full bg-gray-50 border rounded-xl p-3 sm:p-4 text-gray-900 focus:outline-none focus:ring-2 transition-all ${
                  fieldErrors.category 
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                    : "border-gray-200 focus:border-rose-500 focus:ring-rose-200"
                }`}
                required
                disabled={isSubmitting}
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
              {fieldErrors.category && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {fieldErrors.category}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-2">
                Project Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (fieldErrors.description) {
                    setFieldErrors(prev => ({ ...prev, description: "" }));
                  }
                }}
                placeholder="Describe your project in detail. Include specifics about what work needs to be done, materials, timeline, etc."
                rows={6}
                className={`w-full bg-gray-50 border rounded-xl p-3 sm:p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all resize-none ${
                  fieldErrors.description 
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                    : "border-gray-200 focus:border-rose-500 focus:ring-rose-200"
                }`}
                required
                disabled={isSubmitting}
              />
              {fieldErrors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {fieldErrors.description}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                {formData.description.length}/1000 characters
              </p>
            </div>

            {/* Budget and Postal Code Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Budget */}
              <div>
                <label htmlFor="budget" className="block text-sm font-semibold text-gray-800 mb-2">
                  Estimated Budget
                </label>
                <input
                  type="text"
                  id="budget"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="$5,000 - $10,000"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all"
                  disabled={isSubmitting}
                />
              </div>

              {/* Postal Code */}
              <div>
                <label htmlFor="zipCode" className="block text-sm font-semibold text-gray-800 mb-2">
                  Postal Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => {
                    setFormData({ ...formData, zipCode: e.target.value.toUpperCase() });
                    if (fieldErrors.zipCode) {
                      setFieldErrors(prev => ({ ...prev, zipCode: "" }));
                    }
                  }}
                  placeholder="K1A 0A6"
                  pattern="[A-Za-z]\d[A-Za-z][ \-]?\d[A-Za-z]\d"
                  title="Canadian postal code format: A1A 1A1 or A1A-1A1"
                  className={`w-full bg-gray-50 border rounded-xl p-3 sm:p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.zipCode 
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                      : "border-gray-200 focus:border-rose-500 focus:ring-rose-200"
                  }`}
                  required
                  disabled={isSubmitting}
                />
                {fieldErrors.zipCode && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {fieldErrors.zipCode}
                  </p>
                )}
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Project Photos <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <PhotoUploadFixed
                photos={photos}
                onPhotosChange={setPhotos}
                maxPhotos={8}
                disabled={isSubmitting}
              />
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <p className="text-green-800 font-medium">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-800 font-medium">{error}</p>
                    {error.includes("Request ID:") && (
                      <p className="text-xs text-red-700 mt-2 font-mono bg-red-100 px-2 py-1 rounded inline-block">
                        Save this ID for support
                      </p>
                    )}
                    {(error.includes("session") || error.includes("Session") || error.includes("authentication") || error.includes("Authentication")) && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => window.location.reload()}
                          className="text-sm text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                        >
                          Refresh Page
                        </button>
                        <Link 
                          href="/sign-in" 
                          className="text-sm text-red-700 bg-white border border-red-300 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors inline-block"
                        >
                          Sign In Again
                        </Link>
                      </div>
                    )}
                    {error.includes("sign in") && !error.includes("session") && !error.includes("Session") && (
                      <Link href="/sign-in" className="text-sm text-red-700 underline hover:no-underline mt-2 inline-block">
                        Sign in now
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-100 text-gray-700 py-3 sm:py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all border border-gray-200"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || successMessage !== ""}
                className="flex-1 bg-gradient-to-r from-rose-600 to-orange-600 text-white py-3 sm:py-4 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-rose-700 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating Lead...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Post Project</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Why Post on QuoteXbert */}
        <div className="mt-6 sm:mt-8 bg-gradient-to-r from-rose-50 to-orange-50 rounded-xl p-6 border border-rose-100">
          <h3 className="font-bold text-gray-900 mb-4">Why Post on QuoteXbert? 🎉</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span><strong>Free for Homeowners:</strong> Post unlimited projects at no cost</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span><strong>Verified Contractors:</strong> All contractors are background-checked and rated</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span><strong>Multiple Quotes:</strong> Compare bids from qualified professionals</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span><strong>AI-Powered:</strong> Get instant estimates and visualizations</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}