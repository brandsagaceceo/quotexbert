'use client';

import { useState } from 'react';
import { Star, Check, X } from 'lucide-react';

interface ReviewFormProps {
  contractorId: string;
  contractorName: string;
  leadId?: string;
  onSubmit: (reviewData: ReviewData) => Promise<void>;
  onCancel: () => void;
}

interface ReviewData {
  rating: number;
  title: string;
  text: string;
  qualityRating: number;
  timelinessRating: number;
  communicationRating: number;
  cleanlinessRating: number;
  valueRating: number;
  projectType?: string;
  projectCost?: number;
  projectDuration?: string;
}

const ratingCategories = [
  { key: 'qualityRating', label: 'Quality of Work', description: 'How well was the work completed?' },
  { key: 'timelinessRating', label: 'Timeliness', description: 'Did they complete work on time?' },
  { key: 'communicationRating', label: 'Communication', description: 'How well did they communicate?' },
  { key: 'cleanlinessRating', label: 'Cleanliness', description: 'Did they clean up after work?' },
  { key: 'valueRating', label: 'Value for Money', description: 'Was it worth the cost?' }
];

export function ReviewForm({ contractorId, contractorName, leadId, onSubmit, onCancel }: ReviewFormProps) {
  const [reviewData, setReviewData] = useState<ReviewData>({
    rating: 0,
    title: '',
    text: '',
    qualityRating: 0,
    timelinessRating: 0,
    communicationRating: 0,
    cleanlinessRating: 0,
    valueRating: 0
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarClick = (rating: number, field: keyof ReviewData = 'rating') => {
    setReviewData(prev => ({
      ...prev,
      [field]: rating
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewData.rating === 0) {
      alert('Please provide an overall rating');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(reviewData);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (currentRating: number, onStarClick: (rating: number) => void, size = 'h-5 w-5') => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} cursor-pointer transition-colors ${
              star <= currentRating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 hover:text-yellow-400'
            }`}
            onClick={() => onStarClick(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Review {contractorName}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Overall Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating *
              </label>
              {renderStars(reviewData.rating, (rating) => handleStarClick(rating, 'rating'), 'h-8 w-8')}
              <p className="text-sm text-gray-500 mt-1">
                {reviewData.rating === 0 && 'Please select a rating'}
                {reviewData.rating === 1 && 'Poor'}
                {reviewData.rating === 2 && 'Fair'}
                {reviewData.rating === 3 && 'Good'}
                {reviewData.rating === 4 && 'Very Good'}
                {reviewData.rating === 5 && 'Excellent'}
              </p>
            </div>

            {/* Review Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Title
              </label>
              <input
                type="text"
                value={reviewData.title}
                onChange={(e) => setReviewData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Summarize your experience in a few words"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Review
              </label>
              <textarea
                value={reviewData.text}
                onChange={(e) => setReviewData(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Share details about your experience with this contractor..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Detailed Ratings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Ratings</h3>
              <div className="space-y-4">
                {ratingCategories.map((category) => (
                  <div key={category.key}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {category.label}
                        </label>
                        <p className="text-xs text-gray-500">{category.description}</p>
                      </div>
                      {renderStars(
                        reviewData[category.key as keyof ReviewData] as number,
                        (rating) => handleStarClick(rating, category.key as keyof ReviewData)
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Project Details (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Type
                  </label>
                  <input
                    type="text"
                    value={reviewData.projectType}
                    onChange={(e) => setReviewData(prev => ({ ...prev, projectType: e.target.value }))}
                    placeholder="e.g., Kitchen renovation, Plumbing repair"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Cost
                  </label>
                  <input
                    type="number"
                    value={reviewData.projectCost || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setReviewData(prev => {
                        const newData = { ...prev };
                        if (value) {
                          newData.projectCost = parseFloat(value);
                        } else {
                          delete newData.projectCost;
                        }
                        return newData;
                      });
                    }}
                    placeholder="Final project cost"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Duration
                  </label>
                  <input
                    type="text"
                    value={reviewData.projectDuration}
                    onChange={(e) => setReviewData(prev => ({ ...prev, projectDuration: e.target.value }))}
                    placeholder="e.g., 3 days, 1 week, 2 months"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || reviewData.rating === 0}
                className="px-6 py-2 bg-red-900 text-white rounded-md hover:bg-red-950 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}