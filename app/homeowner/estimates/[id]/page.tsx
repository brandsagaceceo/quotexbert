'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {
  ArrowLeft,
  Check,
  Send,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface EstimateItem {
  id: string;
  category: string;
  description: string;
  minCost: number;
  maxCost: number;
  selected: boolean;
  quantity?: number;
  unit?: string;
  notes?: string;
}

interface Estimate {
  id: string;
  description: string;
  minCost: number;
  maxCost: number;
  confidence: number;
  aiPowered: boolean;
  enhancedDescription?: string;
  factors?: string;
  reasoning?: string;
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
  };
}

export default function EstimateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    params.then(setUnwrappedParams);
  }, [params]);

  useEffect(() => {
    if (isLoaded && user && unwrappedParams) {
      fetchEstimate();
    }
  }, [isLoaded, user, unwrappedParams]);

  const fetchEstimate = async () => {
    if (!unwrappedParams) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/ai-estimates?homeownerId=${user?.id}`);
      const data = await response.json();

      if (data.success) {
        const foundEstimate = data.estimates.find((e: Estimate) => e.id === unwrappedParams.id);
        if (foundEstimate) {
          setEstimate(foundEstimate);
          // Initialize selected items
          const selected = new Set<string>(
            foundEstimate.items.filter((item: EstimateItem) => item.selected).map((item: EstimateItem) => item.id)
          );
          setSelectedItems(selected);
        } else {
          setError('Estimate not found');
        }
      } else {
        setError(data.error || 'Failed to fetch estimate');
      }
    } catch (err) {
      console.error('Error fetching estimate:', err);
      setError('Failed to fetch estimate');
    } finally {
      setLoading(false);
    }
  };

  const toggleItemSelection = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const selectAll = () => {
    if (estimate) {
      setSelectedItems(new Set(estimate.items.map((item) => item.id)));
    }
  };

  const deselectAll = () => {
    setSelectedItems(new Set());
  };

  const calculateSelectedCosts = () => {
    if (!estimate) return { min: 0, max: 0 };
    const selectedItemsArray = estimate.items.filter((item) => selectedItems.has(item.id));
    return {
      min: selectedItemsArray.reduce((sum, item) => sum + item.minCost, 0),
      max: selectedItemsArray.reduce((sum, item) => sum + item.maxCost, 0),
    };
  };

  const saveToProfile = async () => {
    if (!estimate) return;

    setPosting(true);
    setError(null);

    try {
      // Update the selected status of items
      const response = await fetch(`/api/ai-estimates/${estimate.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedItemIds: Array.from(selectedItems),
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect back to estimates dashboard
        router.push('/homeowner/estimates');
      } else {
        setError(data.error || 'Failed to save selections');
      }
    } catch (err) {
      console.error('Error saving selections:', err);
      setError('Failed to save selections');
    } finally {
      setPosting(false);
    }
  };

  const postToJobBoard = async () => {
    if (!estimate || selectedItems.size === 0) return;

    setPosting(true);
    setError(null);

    try {
      // First, save the selected items
      const saveResponse = await fetch(`/api/ai-estimates/${estimate.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedItemIds: Array.from(selectedItems),
        }),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save selections');
      }

      // Post to job board
      const response = await fetch(`/api/ai-estimates/${estimate.id}/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to the job board or applications page
        router.push(`/homeowner/jobs/${data.lead.id}/applications`);
      } else {
        // Show user-friendly error messages
        setError(data.error || 'Failed to post to job board. Please try again.');
      }
    } catch (err) {
      console.error('Error posting to job board:', err);
      setError('Failed to post to job board. Please check your connection and try again.');
    } finally {
      setPosting(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading estimate...</p>
        </div>
      </div>
    );
  }

  if (error && !estimate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/homeowner/estimates')}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
          >
            Back to Estimates
          </button>
        </div>
      </div>
    );
  }

  if (!estimate) return null;

  const selectedCosts = calculateSelectedCosts();
  const isPosted = estimate.status === 'posted' || !!estimate.leadId;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/homeowner/estimates')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Estimates
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Estimate Details</h1>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* AI Badge */}
          {estimate.aiPowered && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-rose-100 text-rose-800 mb-4">
              <Sparkles className="w-4 h-4 mr-1" />
              AI-Powered Estimate
            </div>
          )}

          {/* Description */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{estimate.description}</h2>

          {/* Enhanced Description */}
          {estimate.enhancedDescription && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Enhanced Analysis</h3>
              <p className="text-gray-700">{estimate.enhancedDescription}</p>
            </div>
          )}

          {/* Total Cost */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Cost Range</p>
              <p className="text-2xl font-bold text-gray-900">
                ${estimate.minCost.toLocaleString()} - ${estimate.maxCost.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Confidence</p>
              <p className="text-2xl font-bold text-rose-700">{Math.round(estimate.confidence * 100)}%</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <p className="text-2xl font-bold capitalize text-green-600">{estimate.status}</p>
            </div>
          </div>

          {/* Reasoning */}
          {estimate.reasoning && (
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
              <h3 className="text-sm font-semibold text-yellow-900 mb-2">AI Reasoning</h3>
              <p className="text-gray-700">{estimate.reasoning}</p>
            </div>
          )}

          {/* Already Posted Banner */}
          {isPosted && estimate.lead && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-sm font-semibold text-green-900 mb-1">
                    Posted to Job Board
                  </h3>
                  <p className="text-sm text-green-700 mb-2">
                    This estimate has been posted as: <span className="font-medium">{estimate.lead.title}</span>
                  </p>
                  <button
                    onClick={() => router.push(`/homeowner/jobs/${estimate.lead!.id}/applications`)}
                    className="text-sm text-green-600 hover:text-green-800 font-medium"
                  >
                    View Job Applications →
                    </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Items Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Renovation Items</h3>
            {!isPosted && (
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-sm text-rose-700 hover:text-rose-900 font-medium"
                >
                  Select All
                </button>
                <span className="text-gray-400">|</span>
                <button
                  onClick={deselectAll}
                  className="text-sm text-rose-700 hover:text-rose-900 font-medium"
                >
                  Deselect All
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {estimate.items.map((item) => (
              <div
                key={item.id}
                className={`p-4 border rounded-lg transition-all ${
                  selectedItems.has(item.id)
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${isPosted ? 'opacity-75' : 'cursor-pointer'}`}
                onClick={() => !isPosted && toggleItemSelection(item.id)}
              >
                <div className="flex items-start">
                  {!isPosted && (
                    <div className="flex-shrink-0 mr-4 mt-1">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedItems.has(item.id)
                            ? 'bg-rose-600 border-rose-600'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedItems.has(item.id) && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  )}
                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.category}</h4>
                        <p className="text-gray-700 mt-1">{item.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-semibold text-gray-900">
                          ${item.minCost.toLocaleString()} - ${item.maxCost.toLocaleString()}
                        </p>
                        {item.quantity && (
                          <p className="text-sm text-gray-600 mt-1">
                            {item.quantity} {item.unit || 'units'}
                          </p>
                        )}
                      </div>
                    </div>
                    {item.notes && (
                      <p className="text-sm text-gray-600 italic mt-2">Note: {item.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Items Summary & Post Button */}
        {!isPosted && (
          <div className="bg-white rounded-lg shadow-md p-6 sticky bottom-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Selected Items Summary</h3>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Items Selected</p>
                    <p className="text-xl font-bold text-gray-900">
                      {selectedItems.size} of {estimate.items.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cost Range</p>
                    <p className="text-xl font-bold text-green-600">
                      ${selectedCosts.min.toLocaleString()} - ${selectedCosts.max.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={saveToProfile}
                  disabled={posting}
                  className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                >
                  <Check className="w-5 h-5" />
                  {posting ? 'Saving...' : 'Save to Profile'}
                </button>
                <button
                  onClick={postToJobBoard}
                  disabled={selectedItems.size === 0 || posting}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 ${
                    selectedItems.size === 0 || posting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-rose-600 text-white hover:bg-rose-700'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  {posting ? 'Posting...' : 'Post to Job Board'}
                </button>
                {selectedItems.size === 0 && (
                  <p className="text-sm text-red-600 mt-2">Please select at least one item</p>
                )}
              </div>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
