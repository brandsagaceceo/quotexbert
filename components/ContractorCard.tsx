import React from "react";
import Link from "next/link";

interface ContractorInfo {
  userId: string;
  companyName: string;
  trade: string;
  city?: string;
  verified: boolean;
  avgRating: number;
  reviewCount: number;
}

interface ContractorCardProps {
  contractor: ContractorInfo;
  showRating?: boolean;
  showTrade?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ContractorCard({ 
  contractor, 
  showRating = true, 
  showTrade = true,
  size = "md" 
}: ContractorCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`${size === "sm" ? "text-xs" : "text-sm"} ${
          i < Math.floor(rating) ? "text-yellow-400" : "text-gray-600"
        }`}
      >
        ★
      </span>
    ));
  };

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base", 
    lg: "text-lg"
  };

  return (
    <div className={`bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors ${sizeClasses[size]}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Link 
              href={`/contractors/${contractor.userId}`}
              className="font-semibold text-white hover:text-blue-400 transition-colors"
            >
              {contractor.companyName}
            </Link>
            {contractor.verified && (
              <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                ✓
              </span>
            )}
          </div>
          
          {showTrade && (
            <p className="text-gray-400 text-sm capitalize">
              {contractor.trade}
            </p>
          )}
          
          {contractor.city && (
            <p className="text-gray-500 text-sm">
              📍 {contractor.city}
            </p>
          )}
        </div>
      </div>

      {showRating && contractor.reviewCount > 0 && (
        <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
          <div className="flex items-center gap-1">
            {renderStars(contractor.avgRating)}
            <span className="text-sm font-medium text-white ml-1">
              {contractor.avgRating.toFixed(1)}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            ({contractor.reviewCount} review{contractor.reviewCount !== 1 ? 's' : ''})
          </span>
        </div>
      )}
    </div>
  );
}

interface ContractorBadgeProps {
  contractor: ContractorInfo;
  linkToProfile?: boolean;
}

export function ContractorBadge({ contractor, linkToProfile = true }: ContractorBadgeProps) {
  const content = (
    <div className="inline-flex items-center gap-2 bg-gray-700 rounded-full px-3 py-1">
      <span className="text-sm font-medium text-white">
        {contractor.companyName}
      </span>
      {contractor.verified && (
        <span className="text-green-400 text-xs">✓</span>
      )}
      {contractor.avgRating > 0 && (
        <div className="flex items-center gap-1">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-xs text-gray-300">
            {contractor.avgRating.toFixed(1)}
          </span>
        </div>
      )}
    </div>
  );

  if (linkToProfile) {
    return (
      <Link 
        href={`/contractors/${contractor.userId}`}
        className="hover:opacity-80 transition-opacity"
      >
        {content}
      </Link>
    );
  }

  return content;
}

interface ContractorListItemProps {
  contractor: ContractorInfo;
  onSelect?: (contractor: ContractorInfo) => void;
  selected?: boolean;
}

export function ContractorListItem({ 
  contractor, 
  onSelect, 
  selected = false 
}: ContractorListItemProps) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(contractor);
    }
  };

  return (
    <div 
      className={`bg-gray-800 rounded-lg p-4 cursor-pointer transition-all ${
        selected 
          ? "border-2 border-rose-700 bg-blue-900/20" 
          : "border border-gray-700 hover:border-gray-600"
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-white">
              {contractor.companyName}
            </h3>
            {contractor.verified && (
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                ✓ Verified
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="capitalize">{contractor.trade}</span>
            {contractor.city && (
              <span>📍 {contractor.city}</span>
            )}
          </div>
          
          {contractor.reviewCount > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${
                      i < Math.floor(contractor.avgRating) ? "text-yellow-400" : "text-gray-600"
                    }`}
                  >
                    ★
                  </span>
                ))}
                <span className="text-sm font-medium text-white ml-1">
                  {contractor.avgRating.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                ({contractor.reviewCount} reviews)
              </span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-2 ml-4">
          <Link
            href={`/contractors/${contractor.userId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-rose-700 hover:bg-rose-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center"
            onClick={(e) => e.stopPropagation()}
          >
            View Profile
          </Link>
          
          {selected && (
            <span className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center">
              Selected
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
