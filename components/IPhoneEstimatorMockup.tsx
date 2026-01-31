"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { CameraIcon, PhotoIcon, XMarkIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { IPhoneFrame } from "./IPhoneFrame";

interface IPhoneEstimatorMockupProps {
  onEstimateComplete: (result: any) => void;
  userId?: string | undefined;
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
  isExample?: boolean;
}

export function IPhoneEstimatorMockup({ onEstimateComplete, userId }: IPhoneEstimatorMockupProps) {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

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
    cameraInputRef.current?.click();
  };

  const openUpload = () => {
    uploadInputRef.current?.click();
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
      if (photo && !photo.isExample) {
        URL.revokeObjectURL(photo.preview);
      }
      return prev.filter(p => p.id !== id);
    });
  };

  const loadExample = () => {
    setDescription("My kitchen needs new cabinets, countertops, and backsplash. The appliances are staying. About 12ft x 10ft space.");
    setProjectType("Kitchen");
    setPostalCode("M5H 2N2");
    
    // Add example photo placeholder
    const examplePhoto: UploadedPhoto = {
      id: "example-1",
      file: new File([], "example-kitchen.jpg"),
      preview: "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=400&h=300&fit=crop",
      isExample: true,
    };
    setPhotos([examplePhoto]);
    setError("");
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
      // Filter out example photos and convert real photos to base64
      const realPhotos = photos.filter(p => !p.isExample);
      const photoPromises = realPhotos.map(photo => {
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
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('estimate-results')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 300);
    } {/* Background Image with Overlay - TODO: Add /public/mock-livingroom.jpg */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23cbd5e1\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '60px 60px'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/95 backdrop-blur-sm" />
      </div>

      <div className="relative px-4 md:px-6 pb-4">
        {/* Header */}
        <div className="text-center mb-4 pt-2">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-3 shadow-lg">
            <SparkleThumbnails */}
          {photos.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Your Photos ({photos.length}/5)
              </label>
          aria-label="Take a photo with camera"
        />
        <input
          ref={uploadInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          className="hidden"
          aria-label="Upload photos from gallery"
        />

        {/* Microcopy */}
        <p className="text-xs text-center text-slate-500 mb-4 font-medium">
          Photos work best. Add notes if you want.
        </pSparklesIcon className="w-4 h-4" />
            AI Instant Estimate
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-1">
            Upload Phone Photos
          </h3>
          <p className="text-sm text-slate-600">
            Get your detailed estimate in 30 seconds
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Upload Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <DevicePhoneMobileIcon className="w-4 h-4 text-rose-600" />
              Upload Photos (max 5)
            </label>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-xl p-4 text-center cursor-pointer
                transition-all duration-200 relative
                ${isDragging
                  ? "border-orange-500 bg-orange-50 scale-[1.02]"
                  : "border-slate-300 hover:border-orange-400 hover:bg-slate-50"
                }
              `}
            >
              <div className={`transition-all duration-300 ${isDragging ? 'scale-110' : ''}`}>
                <CloudArrowUpIcon className="w-10 h-10 mx-auto mb-2 text-slate-400" />
                <p className="text-sm font-semibold text-slate-700 mb-0.5">
                  Tap to upload or drag photos here
                </p>
                <p className="text-xs text-slate-500">PNG, JPG • Max 5MB each</p>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={handleFileInput}
                className="hidden"
                aria-label="Upload photos"
              />
            </div>

            {/* Photo Thumbnails */}
            {photos.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-3">
                {photos.map(photo => (
                  <div key={photo.id} className="relative group">
                    {photo.isExample && (
                      <div className="absolute top-0 left-0 bg-blue-500 text-white text-[9px] font-bold px-1 py-0.5 rounded-br z-10">
                        Example
                      </div>
                    )}
                    <Image
                      src={photo.preview}
                      alt={photo.isExample ? "Example kitchen" : "Upload preview"}
                      width={80}
                      height={80}
                      className="w-full h-16 object-cover rounded-lg border-2 border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePhoto(photo.id);
                      }}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 
                               opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      aria-label="Remove photo"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-xs font-bold text-slate-700 mb-2">
              Describe your project (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., Kitchen needs new cabinets and countertops..."
              rows={3}
              className="w-full px-3 py-2.5 border-2 border-slate-300 rounded-lg focus:border-orange-500 
                       focus:ring-2 focus:ring-orange-200 outline-none transition-all text-slate-900 text-sm
                       placeholder:text-slate-400"
            />
          </div>

          {/* Project Type */}
          <div>
            <label htmlFor="projectType" className="block text-xs font-bold text-slate-700 mb-2">
              Project Type <span className="text-red-500">*</span>
            </label>
            <select
              id="projectType"
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              required
              className="w-full px-3 py-2.5 border-2 border-slate-300 rounded-lg focus:border-orange-500 
                       focus:ring-2 focus:ring-orange-200 outline-none transition-all text-slate-900 text-sm
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
            <lAdd details (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., Replace kitchen cabinets, 12x10 space..."
              rows={2}
              className="w-full px-3 py-2.5 border-2 border-slate-300 rounded-lg focus:border-orange-500 
                       focus:ring-2 focus:ring-orange-200 outline-none transition-all text-slate-900 text-sm
                       placeholder:text-slate-400 bg-white/80 backdrop-blur-smr-2 border-slate-300 rounded-lg focus:border-orange-500 
                       focus:ring-2 focus:ring-orange-200 outline-none transition-all text-slate-900 text-sm
                       placeholder:text-slate-400 bg-white/80 backdrop-blur-sm"
            />
            <p className="text-xs text-slate-500 mt-1">For accurate GTA pricing</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-2.5">
              <p className="text-xs text-red-700 font-semibold">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"/80 backdrop-blur-sm
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 
                     hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl text-base
                     transition-all transform hover:scale-[1.02] disabled:opacity-50 
                     disabled:cursor-not-allowed disabled:transform-none shadow-xl
                     focus:outline-none focus:ring-4 focus:ring-orange-300"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing Your Project...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <SparklesIcon className="w-5 h-5" />
                Get Instant Quote
              </span>
            )}
          </button>

          {/* Microcopy */}
          <div className="text-center space-y-1">
            <p className="text-xs text-slate-600 font-medium">
              No signup required • Takes ~20 seconds • GTA pricing (CAD)
            </p>
            <button
              type="button"
              onClick={loadExample}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline"
            >
              Try Example Project →
            </button>
          </div>
        </form>
      </div>
    </IPhoneFrame>
  );
}
