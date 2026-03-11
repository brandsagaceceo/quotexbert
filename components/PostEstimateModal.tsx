"use client";

import { useState } from "react";
import {
  Save,
  Upload,
  DollarSign,
  X,
  ArrowRight,
  Lock,
  Globe
} from "lucide-react";

interface EstimateData {
  description: string;
  minCost: number;
  maxCost: number;
  category?: string;
  photos?: string[];
}

interface PostEstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  estimateData: EstimateData;
  onSavePrivate: () => void;
  onPostPublic: () => void;
  isLoading?: boolean;
}

export default function PostEstimateModal({
  isOpen,
  onClose,
  estimateData,
  onSavePrivate,
  onPostPublic,
  isLoading = false
}: PostEstimateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Renovation Estimate</h2>
            <p className="text-gray-600 mt-1">Choose what to do with your estimate</p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Estimate Summary */}
        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Estimated Cost Range</p>
              <p className="text-3xl font-bold text-green-700">
                ${estimateData.minCost.toLocaleString()} - ${estimateData.maxCost.toLocaleString()}
              </p>
            </div>
          </div>
          {estimateData.category && (
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-semibold">Category:</span> {estimateData.category}
            </p>
          )}
        </div>

        {/* Options */}
        <div className="p-6 space-y-4">
          <p className="text-gray-700 font-medium mb-4">What would you like to do next?</p>

          {/* Option 1: Save to Profile */}
          <button
            onClick={onSavePrivate}
            disabled={isLoading}
            className="w-full group"
          >
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Lock className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                    Save to My Projects
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Keep this estimate private on your profile. Review details, add notes, and share with contractors later when you're ready.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      Private
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      Editable
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      Take your time
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </button>

          {/* Option 2: Post to Job Board */}
          <button
            onClick={onPostPublic}
            disabled={isLoading}
            className="w-full group"
          >
            <div className="border-2 border-rose-200 bg-gradient-to-r from-rose-50 to-orange-50 rounded-xl p-6 hover:border-rose-500 hover:from-rose-100 hover:to-orange-100 transition-all cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-r from-rose-500 to-orange-500 rounded-lg group-hover:shadow-lg transition-shadow">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                    Post Job to Contractors
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Make this job visible to qualified contractors. Get applications, compare quotes, and hire the right pro for your project.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Get matched
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      Receive quotes
                    </span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                      Faster results
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Footer Info */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-semibold">Tip:</span> You can always save your project privately first, review the details, and post it to the job board later from your profile.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
