'use client';

import React, { useState } from 'react';

interface PaymentReleaseProps {
  paymentId: string;
  amount: number;
  contractorName: string;
  projectTitle: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  onClose: () => void;
}

export default function PaymentReleaseModal({
  paymentId,
  amount,
  contractorName,
  projectTitle,
  onSuccess,
  onError,
  onClose
}: PaymentReleaseProps) {
  const [releasing, setReleasing] = useState(false);
  const [reason, setReason] = useState('Project completed successfully');

  // Mock user ID - in real app, get from auth
  const userId = 'user_123';

  const handleRelease = async () => {
    setReleasing(true);

    try {
      const response = await fetch('/api/payments/release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId,
          userId,
          reason
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to release payment');
      }

      if (data.success) {
        onSuccess();
        onClose();
      }

    } catch (error) {
      console.error('Payment release error:', error);
      onError(error instanceof Error ? error.message : 'Failed to release payment');
    } finally {
      setReleasing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Release Payment</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="text-sm text-green-800">
              <div className="font-medium">Project: {projectTitle}</div>
              <div>Contractor: {contractorName}</div>
              <div className="text-lg font-bold mt-2">${amount.toLocaleString()}</div>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            This will release the payment from escrow to the contractor. 
            Only release payment when you are completely satisfied with the work.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for release (optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md resize-none"
              rows={2}
              placeholder="Project completed successfully"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="flex items-start">
              <div className="text-yellow-600 mr-2">⚠️</div>
              <div className="text-sm text-yellow-800">
                <div className="font-medium">Important:</div>
                <div>Once released, this payment cannot be recovered. Make sure you are satisfied with the completed work.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleRelease}
            disabled={releasing}
            className={`flex-1 py-2 px-4 rounded-md font-medium ${
              releasing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {releasing ? 'Releasing...' : 'Release Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}