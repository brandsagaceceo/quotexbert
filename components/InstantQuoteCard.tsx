"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { CloudArrowUpIcon, XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import PhotoFeedbackHelper from "@/components/PhotoFeedbackHelper";

interface InstantQuoteCardProps {
  onEstimateComplete: (result: any) => void;
  userId?: string;
}

const PROJECT_TYPES = [
  "Kitchen",
  "Bathroom",
  "Plumbing",
  "Electrical",
  "Roofing",
  "Flooring",
  "Painting",
  "Deck/Fence",
  "Drywall",
  "Landscaping",
  "Basement",
  "Other",
];

interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
}

export function InstantQuoteCard({ onEstimateComplete, userId }: InstantQuoteCardProps) {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith("image/")
    );
    
    addPhotos(files);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addPhotos(files);
  };
  
  const openCamera = () => {
    if (fileInputRef.current) {
      // On mobile, this will open camera directly
      fileInputRef.current.click();
    }
  };

  const addPhotos = (files: File[]) => {
    if (photos.length + files.length > 5) {
      setError("Maximum 5 photos allowed");
      return;
    }

    const newPhotos: UploadedPhoto[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
    }));

    setPhotos(prev => [...prev, ...newPhotos]);
    setError("");
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === id);
      if (photo) {
        URL.revokeObjectURL(photo.preview);
      }
      return prev.filter(p => p.id !== id);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (photos.length === 0 && !description.trim()) {
      setError("Please upload at least one photo or provide a description");
      return;
    }

    if (!projectType) {
      setError("Please select a project type");
      return;
    }

    setIsLoading(true);

    try {
      // Convert photos to base64
      const photoPromises = photos.map(photo => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(photo.file);
        });
      });

      const photoBase64 = await Promise.all(photoPromises);

      const response = await fetch("/api/estimate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: description.trim(),
          photos: photoBase64,
          projectType,
          postalCode: postalCode.trim(),
          userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate estimate");
      }

      onEstimateComplete(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate estimate");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl p-4 md:p-6 lg:p-8 border-2 border-orange-100">
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <div className="bg-gradient-to-br from-rose-500 to-orange-500 p-1.5 md:p-2 rounded-lg">
          <PhotoIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-slate-900">Instant Photo Quote</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-5">
        {/* Photo Upload Area */}
        <div>
          <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5 md:mb-2">
            Upload Photos (Optional, max 5)
          </label>
          
          {/* Mobile-First Camera Button */}
          <button
            type="button"
            onClick={openCamera}
            className="w-full mb-2 md:mb-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white 
                     py-3 md:py-4 px-4 md:px-6 rounded-lg md:rounded-xl font-semibold text-base md:text-lg flex items-center justify-center gap-2 md:gap-3
                     hover:from-rose-600 hover:to-orange-600 transition-all shadow-md md:shadow-lg
                     md:hidden"
          >
            <PhotoIcon className="w-7 h-7" />
            📸 Take Photo
          </button>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
              transition-all duration-200
              ${isDragging
                ? "border-orange-500 bg-orange-50"
                : "border-slate-300 hover:border-orange-400 hover:bg-slate-50"
              }
            `}
          >
            <CloudArrowUpIcon className="w-12 h-12 mx-auto mb-3 text-slate-400" />
            <p className="text-sm font-medium text-slate-700 mb-1">
              <span className="md:inline hidden">Drop photos here or </span>Click to upload
            </p>
            <p className="text-xs text-slate-500">PNG, JPG up to 5MB each</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {/* Photo Thumbnails */}
          {photos.length > 0 && (
            <div className="grid grid-cols-5 gap-3 mt-4">
              {photos.map(photo => (
                <div key={photo.id} className="relative group">
                  <Image
                    src={photo.preview}
                    alt="Upload preview"
                    width={100}
                    height={100}
                    className="w-full h-20 object-cover rounded-lg border-2 border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(photo.id);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 
                             opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* NEW: AI Photo Feedback - Non-blocking suggestion */}
          <PhotoFeedbackHelper photoCount={photos.length} />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5 md:mb-2">
            What are we looking at? (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="E.g., Kitchen needs new cabinets and countertops, appliances are staying"
            rows={3}
            className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-slate-300 rounded-lg focus:border-orange-500 
                     focus:ring-2 focus:ring-orange-200 outline-none transition-all text-slate-900 text-sm md:text-base"
          />
        </div>

        {/* Project Type */}
        <div>
          <label htmlFor="projectType" className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5 md:mb-2">
            Project Type *
          </label>
          <select
            id="projectType"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            required
            className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-slate-300 rounded-lg focus:border-orange-500 
                     focus:ring-2 focus:ring-orange-200 outline-none transition-all text-slate-900 text-sm md:text-base
                     bg-white cursor-pointer"
          >
            <option value="">Select project type...</option>
            {PROJECT_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Postal Code */}
        <div>
          <label htmlFor="postalCode" className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5 md:mb-2">
            Postal Code (Optional)
          </label>
          <input
            id="postalCode"
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
            placeholder="M1A 1A1"
            maxLength={7}
            className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-slate-300 rounded-lg focus:border-orange-500 
                     focus:ring-2 focus:ring-orange-200 outline-none transition-all text-slate-900 text-sm md:text-base"
          />
          <p className="text-xs text-slate-500 mt-1">For accurate GTA pricing</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-2.5 md:p-3">
            <p className="text-xs md:text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 
                   hover:to-orange-700 text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-lg md:rounded-xl text-sm md:text-base
                   transition-all transform hover:scale-[1.02] disabled:opacity-50 
                   disabled:cursor-not-allowed disabled:transform-none shadow-lg md:shadow-xl"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing...
            </span>
          ) : (
            "Get Instant Quote"
          )}
        </button>

        <p className="text-center text-xs text-slate-500">
          No signup required • Takes ~20 seconds
        </p>
      </form>
    </div>
  );
}
