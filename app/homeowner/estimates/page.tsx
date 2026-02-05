'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Calendar, DollarSign, FileText, CheckCircle, Clock, Send } from 'lucide-react';

interface EstimateItem {
  id: string;
  category: string;
  description: string;
  minCost: number;
  maxCost: number;
  selected: boolean;
  quantity?: number;
  unit?: string;
}

interface Estimate {
  id: string;
  description: string;
  minCost: number;
  maxCost: number;
  confidence: number;
  status: string;
  isPublic: boolean;
  createdAt: string;
  items: EstimateItem[];
  leadId?: string;
  lead?: {
    id: string;
    title: string;
    status: string;
    published: boolean;
    applications: Array<{
      id: string;
      contractor: {
        id: string;
        name: string | null;
      };
    }>;
  };
}

export default function HomeownerEstimatesPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchEstimates();
    }
  }, [isLoaded, user]);

  const fetchEstimates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ai-estimates?homeownerId=${user?.id}`);
      const data = await response.json();

      if (data.success) {
        setEstimates(data.estimates);
      } else {
        setError(data.error || 'Failed to fetch estimates');
      }
    } catch (err) {
      console.error('Error fetching estimates:', err);
      setError('Failed to fetch estimates');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (estimate: Estimate) => {
    if (estimate.status === 'posted') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Send className="w-3 h-3 mr-1" />
          Posted to Job Board
        </span>
      );
    }
    if (estimate.status === 'saved') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-900">
          <CheckCircle className="w-3 h-3 mr-1" />
          Saved
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <Clock className="w-3 h-3 mr-1" />
        Draft
      </span>
    );
  };

  const formatCost = (min: number, max: number) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your estimates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchEstimates}
            className="mt-4 px-4 py-2 bg-rose-700 text-white rounded-lg hover:bg-rose-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Renovation Estimates</h1>
          <p className="mt-2 text-gray-600">
            View and manage your AI-generated renovation estimates
          </p>
        </div>

        {/* Get New Estimate Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-rose-700 text-white rounded-lg hover:bg-rose-800 transition-colors"
          >
            + Get New Estimate
          </button>
        </div>

        {/* Estimates Grid */}
        {estimates.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No estimates yet</h3>
            <p className="text-gray-600 mb-4">
              Get started by creating your first renovation estimate
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-rose-700 text-white rounded-lg hover:bg-rose-800 transition-colors"
            >
              Get Your First Estimate
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {estimates.map((estimate) => (
              <div
                key={estimate.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/homeowner/estimates/${estimate.id}`)}
              >
                <div className="p-6">
                  {/* Status Badge */}
                  <div className="mb-4">{getStatusBadge(estimate)}</div>

                  {/* Description */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                    {estimate.description}
                  </h3>

                  {/* Cost Range */}
                  <div className="flex items-center text-gray-700 mb-3">
                    <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                    <span className="font-medium">{formatCost(estimate.minCost, estimate.maxCost)}</span>
                  </div>

                  {/* Items Count */}
                  <div className="flex items-center text-gray-600 mb-3">
                    <FileText className="w-5 h-5 mr-2 text-rose-700" />
                    <span>{estimate.items.length} items</span>
                    {estimate.items.some((item) => item.selected) && (
                      <span className="ml-2 text-green-600">
                        ({estimate.items.filter((item) => item.selected).length} selected)
                      </span>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(estimate.createdAt)}</span>
                  </div>

                  {/* Job Board Info */}
                  {estimate.lead && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">
                        Posted as: <span className="font-medium">{estimate.lead.title}</span>
                      </p>
                      {estimate.lead.applications.length > 0 && (
                        <p className="text-sm text-green-600 font-medium">
                          {estimate.lead.applications.length} contractor bid{estimate.lead.applications.length !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Confidence Score */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Confidence</span>
                      <span>{Math.round(estimate.confidence * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-rose-700 h-2 rounded-full"
                        style={{ width: `${estimate.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-3 bg-gray-50 rounded-b-lg">
                  <button className="text-rose-700 hover:text-rose-900 font-medium text-sm">
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
