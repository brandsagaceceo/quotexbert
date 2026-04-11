"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface Review {
  id: string;
  rating: number;
  text: string | null;
  createdAt: string;
  homeowner: {
    name: string | null;
  };
}

interface ReviewsListProps {
  contractorId: string;
  limit?: number;
}

export function ReviewsList({ contractorId, limit }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [contractorId]);

  const fetchReviews = async () => {
    try {
      const url = `/api/reviews/${contractorId}${limit ? `?limit=${limit}` : ""}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setReviews(data.reviews || []);
        setAverageRating(data.averageRating || 0);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-slate-200 rounded w-1/3"></div>
        <div className="h-20 bg-slate-200 rounded"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-slate-600">
        <p>No reviews yet</p>
      </div>
    );
  }

  return (
    <div>
      {/* Average Rating Header */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-slate-900">
            {averageRating.toFixed(1)}
          </span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-6 h-6 ${
                  star <= Math.round(averageRating)
                    ? "text-amber-400 fill-current"
                    : "text-slate-300"
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
        <span className="text-slate-600">
          {reviews.length} review{reviews.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-slate-200 pb-6 last:border-b-0"
          >
            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? "text-amber-400 fill-current"
                        : "text-slate-300"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-slate-500">
                {formatDistanceToNow(new Date(review.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>

            {/* Comment */}
            {review.text && (
              <p className="text-slate-700 mb-2 leading-relaxed">
                "{review.text}"
              </p>
            )}

            {/* Reviewer */}
            <p className="text-sm text-slate-600">
              — {review.homeowner?.name || "Anonymous"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
