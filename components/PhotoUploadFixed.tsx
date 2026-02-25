"use client";

import { useState, useRef, useEffect } from "react";
import { X, Upload, Image as ImageIcon, Check } from "lucide-react";

interface PhotoUploadProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  disabled?: boolean;
}

interface PhotoItem {
  id: string;
  file: File;
  previewUrl: string;
  uploadedUrl?: string;
  uploading: boolean;
  error?: string;
}

export default function PhotoUploadFixed({ 
  photos, 
  onPhotosChange, 
  maxPhotos = 8,
  disabled = false 
}: PhotoUploadProps) {
  const [photoItems, setPhotoItems] = useState<PhotoItem[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [initializedFromProps, setInitializedFromProps] = useState(false);

  // Initialize from photos prop (for base64 images from home page estimate)
  useEffect(() => {
    if (!initializedFromProps && photos && photos.length > 0) {
      console.log('PhotoUploadFixed: Initializing with', photos.length, 'photos from props');
      
      // Convert base64/URL photos to PhotoItem format
      const items: PhotoItem[] = photos.map((photoUrl, index) => ({
        id: `loaded-${index}-${Date.now()}`,
        file: new File([], `loaded-photo-${index}.jpg`, { type: 'image/jpeg' }), // Dummy file
        previewUrl: photoUrl, // Use the base64 or URL directly
        uploadedUrl: photoUrl, // Already uploaded (or base64 to be saved)
        uploading: false
      }));
      
      setPhotoItems(items);
      setInitializedFromProps(true);
    }
  }, [photos, initializedFromProps]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      photoItems.forEach(item => {
        if (item.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, [photoItems]);

  // Sync uploadedUrls with parent
  useEffect(() => {
    const uploadedUrls = photoItems
      .filter(item => item.uploadedUrl)
      .map(item => item.uploadedUrl!);
    
    // Always notify parent, even if empty (so removal is tracked)
    onPhotosChange(uploadedUrls);
  }, [photoItems, onPhotosChange]);

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return `${file.name}: Invalid file type. Only JPEG, PNG, and WebP are allowed.`;
    }

    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return `${file.name}: File is ${sizeMB}MB. Maximum size is 5MB.`;
    }

    return null;
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxPhotos - photoItems.length;
    if (remainingSlots <= 0) {
      alert(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    const filesToAdd = Array.from(files).slice(0, remainingSlots);
    
    // Validate all files first
    const errors: string[] = [];
    const validFiles: File[] = [];
    
    filesToAdd.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      alert(errors.join('\n\n'));
      return;
    }

    // Create photo items with immediate local previews
    const newItems: PhotoItem[] = validFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
      file,
      previewUrl: URL.createObjectURL(file), // Immediate local preview
      uploading: false
    }));

    setPhotoItems(prev => [...prev, ...newItems]);

    // Start uploading in background
    uploadPhotosInBackground(newItems);
  };

  const uploadPhotosInBackground = async (items: PhotoItem[]) => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (!item) continue; // Skip if undefined
      
      // Skip if already uploaded (loaded from props)
      if (item.uploadedUrl && !item.uploadedUrl.startsWith('blob:')) {
        console.log('Skipping upload for already-uploaded photo:', item.id);
        continue;
      }
      
      // Update status to uploading
      setPhotoItems(prev => prev.map(p => 
        p.id === item.id ? { ...p, uploading: true } : p
      ));
      
      setUploadProgress(`Uploading ${i + 1}/${items.length}...`);

      try {
        const formData = new FormData();
        formData.append('photos', item.file);
        formData.append('type', 'leads');

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Upload failed");
        }

        const result = await response.json();
        const uploadedUrl = result.files?.[0] || result.url;

        if (!uploadedUrl) {
          throw new Error("No URL returned from upload");
        }

        // Update with uploaded URL
        setPhotoItems(prev => prev.map(p => 
          p.id === item.id 
            ? { ...p, uploading: false, uploadedUrl } 
            : p
        ));
        
        // Track Clarity event for successful photo upload
        if (typeof window !== 'undefined' && (window as any).clarity) {
          (window as any).clarity('event', 'photo_upload_success', {
            photoIndex: i + 1,
            totalPhotos: items.length,
            hasPreview: true
          });
        }

      } catch (error) {
        if (!item) continue; // Skip if undefined
        console.error("Upload error for", item.file?.name || 'unknown file', error);
        
        // Mark as error but keep local preview
        setPhotoItems(prev => prev.map(p => 
          p.id === item.id 
            ? { 
                ...p, 
                uploading: false, 
                error: error instanceof Error ? error.message : "Upload failed",
                uploadedUrl: p.previewUrl // Fallback to local preview if upload fails
              } 
            : p
        ));
      }
    }

    setUploadProgress("");
  };

  const removePhoto = (id: string) => {
    setPhotoItems(prev => {
      const item = prev.find(p => p.id === id);
      
      // Cleanup blob URL
      if (item && item.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(item.previewUrl);
      }

      // Delete from server if uploaded
      if (item?.uploadedUrl && !item.uploadedUrl.startsWith('blob:')) {
        fetch(`/api/upload?file=${encodeURIComponent(item.uploadedUrl)}`, {
          method: "DELETE",
        }).catch(err => console.error("Failed to delete from server:", err));
      }

      return prev.filter(p => p.id !== id);
    });
  };

  const retryUpload = (id: string) => {
    const item = photoItems.find(p => p.id === id);
    if (item) {
      uploadPhotosInBackground([item]);
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
          border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
          ${dragActive 
            ? "border-rose-500 bg-rose-50 scale-105" 
            : "border-gray-300 hover:border-rose-400 hover:bg-gray-50"
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
        
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-r from-rose-100 to-orange-100 p-4 rounded-full mb-4">
            <Upload className="w-8 h-8 text-rose-600" />
          </div>
          
          <p className="text-lg font-semibold text-gray-800 mb-2">
            {photoItems.length > 0 ? "Add More Photos" : "Upload Project Photos"}
          </p>
          
          <p className="text-sm text-gray-600 mb-1">
            Drag & drop or click to select
          </p>
          
          <p className="text-xs text-gray-500">
            JPEG, PNG, WebP • Max 5MB each • Up to {maxPhotos} photos
          </p>
          
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${photoItems.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-xs text-gray-600">{photoItems.length}/{maxPhotos}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploadProgress && (
        <div className="flex items-center justify-center gap-2 text-sm text-rose-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-600"></div>
          <span>{uploadProgress}</span>
        </div>
      )}

      {/* Photo Grid */}
      {photoItems.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photoItems.map((item, index) => (
            <div key={item.id} className="relative group">
              <div className="aspect-square relative rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-100">
                {/* Preview Image */}
                <img
                  src={item.previewUrl}
                  alt={`Project photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Uploading Overlay */}
                {item.uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                      <p className="text-xs">Uploading...</p>
                    </div>
                  </div>
                )}

                {/* Success Indicator */}
                {item.uploadedUrl && !item.uploading && !item.error && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
                    <Check className="w-3 h-3" />
                  </div>
                )}

                {/* Error Indicator */}
                {item.error && (
                  <div className="absolute inset-0 bg-red-500 bg-opacity-90 flex items-center justify-center p-2">
                    <div className="text-center text-white">
                      <p className="text-xs mb-2">Upload failed</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          retryUpload(item.id);
                        }}
                        className="text-xs underline hover:no-underline"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Remove Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto(item.id);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-10"
                disabled={disabled}
                aria-label={`Remove photo ${index + 1}`}
              >
                <X className="w-4 h-4" />
              </button>
              
              {/* Photo Number */}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-md font-medium">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      <div className="bg-gradient-to-r from-rose-50 to-orange-50 p-4 rounded-xl border border-rose-200">
        <div className="flex items-start gap-3">
          <div className="bg-white p-2 rounded-lg">
            <ImageIcon className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">📸 Photo Tips for Better Quotes:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ Take photos from multiple angles</li>
              <li>✓ Show existing damage or specific details</li>
              <li>✓ Use good lighting for clarity</li>
              <li>✓ Include measurements or reference objects for scale</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
