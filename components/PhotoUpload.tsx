"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface PhotoUploadProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  disabled?: boolean;
}

export default function PhotoUpload({ 
  photos, 
  onPhotosChange, 
  maxPhotos = 10,
  disabled = false 
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxPhotos - photos.length;
    if (remainingSlots <= 0) {
      alert(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    await uploadFiles(filesToUpload);
  };

  const uploadFiles = async (files: File[]) => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`photos-${index}`, file);
      });

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const result = await response.json();
      onPhotosChange([...photos, ...result.files]);
      
    } catch (error) {
      console.error("Upload error:", error);
      alert(error instanceof Error ? error.message : "Failed to upload photos");
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async (photoUrl: string, index: number) => {
    try {
      // Remove from UI immediately
      const newPhotos = photos.filter((_, i) => i !== index);
      onPhotosChange(newPhotos);

      // Delete from server
      const response = await fetch(`/api/upload?file=${encodeURIComponent(photoUrl)}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error("Failed to delete photo from server");
      }
    } catch (error) {
      console.error("Error removing photo:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const openFileSelector = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragActive 
            ? "border-burgundy-500 bg-burgundy-50" 
            : "border-gray-300 hover:border-burgundy-400"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileSelector}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />
        
        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy-600 mb-2"></div>
            <p className="text-sm text-gray-600">Uploading photos...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg
              className="w-12 h-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-lg font-medium text-gray-700 mb-2">
              Upload Project Photos
            </p>
            <p className="text-sm text-gray-500">
              Drag & drop or click to select photos
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPEG, PNG, WebP • Max 5MB each • Up to {maxPhotos} photos
            </p>
            <p className="text-xs text-gray-400">
              {photos.length}/{maxPhotos} photos uploaded
            </p>
          </div>
        )}
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={photo}
                  alt={`Project photo ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>
              
              {/* Remove Button */}
              <button
                onClick={() => removePhoto(photo, index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                disabled={disabled}
              >
                ×
              </button>
              
              {/* Photo Number */}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">📸 Photo Tips:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Include multiple angles of the project area</li>
          <li>• Show any existing damage or specific details</li>
          <li>• Take photos in good lighting for clarity</li>
          <li>• Include before photos if renovating existing work</li>
        </ul>
      </div>
    </div>
  );
}