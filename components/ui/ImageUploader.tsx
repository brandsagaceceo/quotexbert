"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";

interface ImageUploaderProps {
  onImagesSelected: (images: File[], previews: string[]) => void;
  maxImages?: number;
  className?: string;
}

export function ImageUploader({ onImagesSelected, maxImages = 5, className = "" }: ImageUploaderProps) {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).filter(file => {
      // Check if it's an image
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 10MB`);
        return false;
      }
      
      return true;
    });

    // Limit total number of images
    const totalImages = images.length + newFiles.length;
    if (totalImages > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    // Create previews
    const newPreviews: string[] = [];
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newPreviews.push(e.target.result as string);
          if (newPreviews.length === newFiles.length) {
            // All previews loaded
            const updatedImages = [...images, ...newFiles];
            const updatedPreviews = [...previews, ...newPreviews];
            setImages(updatedImages);
            setPreviews(updatedPreviews);
            onImagesSelected(updatedImages, updatedPreviews);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setImages(updatedImages);
    setPreviews(updatedPreviews);
    onImagesSelected(updatedImages, updatedPreviews);
  };

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
    handleFileSelect(e.dataTransfer.files);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const capturePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });

      // Create video element to show camera feed
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;

      // Create modal for camera
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
      
      const container = document.createElement('div');
      container.className = 'bg-white rounded-lg p-4 max-w-md w-full mx-4';
      
      const title = document.createElement('h3');
      title.className = 'text-lg font-semibold mb-4 text-center';
      title.textContent = 'Take a Photo';
      
      video.className = 'w-full rounded-lg mb-4';
      
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'flex space-x-3 justify-center';
      
      const captureBtn = document.createElement('button');
      captureBtn.className = 'bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700';
      captureBtn.textContent = 'Capture';
      
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700';
      cancelBtn.textContent = 'Cancel';

      const cleanup = () => {
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(modal);
      };

      captureBtn.onclick = () => {
        // Create canvas to capture photo
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
            const dt = new DataTransfer();
            dt.items.add(file);
            handleFileSelect(dt.files);
          }
          cleanup();
        }, 'image/jpeg', 0.8);
      };

      cancelBtn.onclick = cleanup;

      buttonContainer.appendChild(captureBtn);
      buttonContainer.appendChild(cancelBtn);
      container.appendChild(title);
      container.appendChild(video);
      container.appendChild(buttonContainer);
      modal.appendChild(container);
      document.body.appendChild(modal);

    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check your permissions or use the file upload instead.');
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            📸 Project Photos
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({images.length}/{maxImages} images)
            </span>
          </h3>
        </div>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="text-4xl">📷</div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                Add photos of your project
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Drag and drop images here, or click to browse
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                onClick={openFileDialog}
                disabled={images.length >= maxImages}
              >
                📁 Choose Files
              </Button>
              
              <Button
                variant="secondary"
                onClick={capturePhoto}
                disabled={images.length >= maxImages}
              >
                📸 Take Photo
              </Button>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        {/* Image Previews */}
        {images.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Uploaded Images:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                    {Math.round((images[index]?.size || 0) / 1024)}KB
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500 space-y-1">
          <p>💡 Tips for better estimates:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Include multiple angles of the project area</li>
            <li>Show existing conditions and damage clearly</li>
            <li>Include measurements or reference objects for scale</li>
            <li>Take photos in good lighting</li>
            <li>Supported formats: JPG, PNG, GIF (max 10MB each)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}