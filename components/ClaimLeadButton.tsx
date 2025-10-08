"use client";

import { useState } from "react";

interface Lead {
  id: string;
  title: string;
  description: string;
  budget?: string;
  location?: string;
  createdAt: string;
  homeowner: {
    id: string;
    email: string;
  };
  contractorId?: string;
  status?: string;
}

interface ClaimLeadButtonProps {
  lead: Lead;
  currentUserId: string;
  onLeadClaimed?: () => void;
}

export default function ClaimLeadButton({ lead, currentUserId, onLeadClaimed }: ClaimLeadButtonProps) {
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPricing, setShowPricing] = useState(false);

  // Determine project type and pricing
  const determineProjectType = (description: string, title: string) => {
    const text = `${description} ${title}`.toLowerCase();
    
    if (text.includes('kitchen') || text.includes('cabinet') || text.includes('countertop')) {
      return { type: 'Kitchen Renovation', price: 15.00, description: 'Kitchen projects, cabinets, countertops' };
    } else if (text.includes('bathroom') || text.includes('shower') || text.includes('vanity')) {
      return { type: 'Bathroom Renovation', price: 12.00, description: 'Bathroom projects, showers, vanities' };
    } else if (text.includes('renovation') || text.includes('remodel') || text.includes('addition')) {
      return { type: 'Major Renovation', price: 20.00, description: 'Large renovations, additions, major remodels' };
    } else {
      return { type: 'General Repair', price: 8.00, description: 'General repairs and maintenance' };
    }
  };

  const projectInfo = determineProjectType(lead.description, lead.title);

  const handleClaimLead = async () => {
    if (claiming) return;

    setClaiming(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/claim-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          leadId: lead.id,
          amount: projectInfo.price * 100 // Convert to cents
        })
      });

      const data = await response.json();

      if (response.ok) {
        onLeadClaimed?.();
      } else {
        if (data.requiresPaymentSetup) {
          setError(`Payment method required. Please set up billing in your profile first.`);
        } else {
          setError(data.error || 'Failed to claim lead');
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setClaiming(false);
    }
  };

  // Don't show button if lead is already claimed
  if (lead.contractorId && lead.contractorId !== currentUserId) {
    return (
      <div className="text-center p-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
          Already Claimed
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Pricing Information */}
      <div className="bg-gradient-to-r from-teal-50 to-burgundy-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">{projectInfo.type}</h4>
            <p className="text-sm text-gray-600">{projectInfo.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-teal-600">
              ${projectInfo.price.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">Lead claim fee</div>
          </div>
        </div>
        
        {!showPricing && (
          <button
            onClick={() => setShowPricing(true)}
            className="mt-2 text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            View pricing details →
          </button>
        )}
      </div>

      {/* Detailed Pricing */}
      {showPricing && (
        <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Lead claim fee:</span>
            <span className="font-semibold">${projectInfo.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Processing fee:</span>
            <span className="font-semibold">$0.00</span>
          </div>
          <div className="border-t pt-2 flex justify-between items-center">
            <span className="font-semibold text-gray-900">Total:</span>
            <span className="text-xl font-bold text-teal-600">${projectInfo.price.toFixed(2)}</span>
          </div>
          
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Only pay when you claim a lead</p>
            <p>• 100% refund if homeowner doesn't respond within 48 hours</p>
            <p>• No monthly fees or hidden charges</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-red-500">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-600">{error}</p>
              {error.includes('Payment method required') && (
                <a
                  href="/billing"
                  className="mt-2 inline-flex items-center text-sm text-red-700 hover:text-red-800 font-medium"
                >
                  Set up billing →
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Claim Button */}
      <button
        onClick={handleClaimLead}
        disabled={claiming}
        className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
      >
        {claiming ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Claiming Lead...</span>
          </div>
        ) : (
          `Claim Lead for $${projectInfo.price.toFixed(2)}`
        )}
      </button>

      {/* Success Guarantee */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          🛡️ Protected by our Success Guarantee - full refund if no response
        </p>
      </div>
    </div>
  );
}