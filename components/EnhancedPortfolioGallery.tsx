"use client";

import { useState } from "react";
import Image from "next/image";

interface PortfolioItemProps {
  id: string;
  title: string;
  caption?: string;
  projectType: string;
  beforeImages: string[];
  afterImages: string[];
  imageUrl?: string; // Legacy support
  createdAt: string;
}

interface EnhancedPortfolioGalleryProps {
  portfolioItems: PortfolioItemProps[];
  onDeleteItem?: (id: string) => void;
}

export default function EnhancedPortfolioGallery({ 
  portfolioItems, 
  onDeleteItem 
}: EnhancedPortfolioGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<PortfolioItemProps | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatProjectType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      kitchen: "Kitchen Renovation",
      bathroom: "Bathroom Renovation",
      electrical: "Electrical Work",
      plumbing: "Plumbing",
      flooring: "Flooring",
      painting: "Painting",
      roofing: "Roofing",
      hvac: "HVAC",
      landscaping: "Landscaping",
      general: "General Contracting",
      handyman: "Handyman Services",
      other: "Other"
    };
    return typeMap[type] || type;
  };

  const renderImageGrid = (images: string[], title: string, type: 'before' | 'after') => {
    if (images.length === 0) return null;

    return (
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
          {type === 'before' ? (
            <>
              <span className="bg-red-600 text-white px-2 py-1 rounded text-sm mr-2">BEFORE</span>
              Before Photos
            </>
          ) : (
            <>
              <span className="bg-green-600 text-white px-2 py-1 rounded text-sm mr-2">AFTER</span>
              After Photos
            </>
          )}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
              <Image
                src={image}
                alt={`${title} - ${type} photo ${index + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (portfolioItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-300 mb-2">No portfolio items yet</h3>
        <p className="text-gray-400 mb-6">
          Start building your portfolio by showcasing your best before & after projects.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {portfolioItems.map((item) => {
          const beforeImages = item.beforeImages || [];
          const afterImages = item.afterImages || [];
          const allImages = [...beforeImages, ...afterImages];
          
          // Fallback to legacy imageUrl if no before/after images
          const displayImages = allImages.length > 0 ? allImages : (item.imageUrl ? [item.imageUrl] : []);
          const mainImage = displayImages[0] || '/placeholder-image.jpg';

          return (
            <div 
              key={item.id} 
              className="bg-gray-700 rounded-lg overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => setSelectedItem(item)}
            >
              {/* Main Image */}
              <div className="relative h-48">
                <Image
                  src={mainImage}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
                {/* Photo Count Badge */}
                {displayImages.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    +{displayImages.length - 1}
                  </div>
                )}
                {/* Before/After Badge */}
                {beforeImages.length > 0 && afterImages.length > 0 && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    BEFORE/AFTER
                  </div>
                )}
              </div>

              {/* Project Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-white line-clamp-1 flex-1">
                    {item.title}
                  </h3>
                  {onDeleteItem && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item.id);
                      }}
                      className="text-red-400 hover:text-red-300 ml-2"
                      title="Delete project"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
                
                <span className="inline-block bg-burgundy-600 text-white px-2 py-1 rounded text-xs font-medium mb-2">
                  {formatProjectType(item.projectType)}
                </span>
                
                {item.caption && (
                  <p className="text-gray-300 text-sm mb-2 line-clamp-2">
                    {item.caption}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatDate(item.createdAt)}</span>
                  <div className="flex gap-2">
                    {beforeImages.length > 0 && (
                      <span className="bg-red-600/20 text-red-400 px-2 py-1 rounded">
                        {beforeImages.length} Before
                      </span>
                    )}
                    {afterImages.length > 0 && (
                      <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded">
                        {afterImages.length} After
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed View Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedItem.title}</h2>
                  <span className="inline-block bg-burgundy-600 text-white px-3 py-1 rounded text-sm font-medium">
                    {formatProjectType(selectedItem.projectType)}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Description */}
              {selectedItem.caption && (
                <div className="mb-6">
                  <p className="text-gray-300 leading-relaxed">{selectedItem.caption}</p>
                </div>
              )}

              {/* Before Photos */}
              {renderImageGrid(selectedItem.beforeImages, selectedItem.title, 'before')}

              {/* After Photos */}
              {renderImageGrid(selectedItem.afterImages, selectedItem.title, 'after')}

              {/* Legacy Image Support */}
              {selectedItem.imageUrl && selectedItem.beforeImages.length === 0 && selectedItem.afterImages.length === 0 && (
                <div className="mb-6">
                  <div className="aspect-video relative rounded-lg overflow-hidden">
                    <Image
                      src={selectedItem.imageUrl}
                      alt={selectedItem.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="text-sm text-gray-500 pt-4 border-t border-gray-700">
                Added {formatDate(selectedItem.createdAt)}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}