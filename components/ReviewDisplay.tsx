'use client';

import { useState, useEffect } from 'react';
import { Star, Calendar } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  title?: string;
  text?: string;
  qualityRating?: number;
  timelinessRating?: number;
  communicationRating?: number;
  cleanlinessRating?: number;
  valueRating?: number;
  projectType?: string;
  projectCost?: number;
  projectDuration?: string;
  createdAt: string;
  homeowner: {
    id: string;
    email: string;
  };
}

interface ReviewDisplayProps {
  contractorId: string;
  showTitle?: boolean;
  maxReviews?: number;
}

export function ReviewDisplay({ contractorId, showTitle = true, maxReviews }: ReviewDisplayProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);

  useEffect(() => {
    fetchReviews();
  }, [contractorId]);

  const fetchReviews = async () => {
    try {
      const params = new URLSearchParams({
        contractorId,
        ...(maxReviews && { limit: maxReviews.toString() })
      });
      
      const response = await fetch(`/api/reviews?${params}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews);
        setTotalReviews(data.pagination.totalCount);
        
        // Calculate average rating
        if (data.reviews.length > 0) {
          const avg = data.reviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / data.reviews.length;
          setAverageRating(avg);
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, size = 'h-4 w-4') => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= Math.round(rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
        <p className="text-gray-600">This contractor hasn't received any reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showTitle && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
            <div className="text-right">
              <div className="flex items-center gap-2">
                {renderStars(averageRating, 'h-5 w-5')}
                <span className="text-lg font-semibold text-gray-900">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border border-gray-200 rounded-lg p-6 bg-white">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-900 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {getInitials(review.homeowner.email)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {renderStars(review.rating)}
                    <span className="text-sm font-medium text-gray-900">
                      {review.rating} out of 5
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {formatDate(review.createdAt)}
                  </div>
                </div>
              </div>
            </div>

            {review.title && (
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{review.title}</h4>
            )}

            {review.text && (
              <p className="text-gray-700 mb-4 leading-relaxed">{review.text}</p>
            )}

            {/* Detailed Ratings */}
            {(review.qualityRating || review.timelinessRating || review.communicationRating || 
              review.cleanlinessRating || review.valueRating) && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-4 border-t border-gray-100">
                {review.qualityRating && (
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900 mb-1">Quality</div>
                    {renderStars(review.qualityRating, 'h-3 w-3')}
                  </div>
                )}
                {review.timelinessRating && (
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900 mb-1">Timeliness</div>
                    {renderStars(review.timelinessRating, 'h-3 w-3')}
                  </div>
                )}
                {review.communicationRating && (
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900 mb-1">Communication</div>
                    {renderStars(review.communicationRating, 'h-3 w-3')}
                  </div>
                )}
                {review.cleanlinessRating && (
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900 mb-1">Cleanliness</div>
                    {renderStars(review.cleanlinessRating, 'h-3 w-3')}
                  </div>
                )}
                {review.valueRating && (
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900 mb-1">Value</div>
                    {renderStars(review.valueRating, 'h-3 w-3')}
                  </div>
                )}
              </div>
            )}

            {/* Project Details */}
            {(review.projectType || review.projectCost || review.projectDuration) && (
              <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
                {review.projectType && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">Project:</span>
                    <span>{review.projectType}</span>
                  </div>
                )}
                {review.projectCost && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">Cost:</span>
                    <span>${review.projectCost.toLocaleString()}</span>
                  </div>
                )}
                {review.projectDuration && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">Duration:</span>
                    <span>{review.projectDuration}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {maxReviews && totalReviews > maxReviews && (
        <div className="text-center pt-4">
          <p className="text-gray-600">
            Showing {maxReviews} of {totalReviews} reviews
          </p>
        </div>
      )}
    </div>
  );
}