"use client";

import { useState } from "react";
import { CreditCard, DollarSign, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  amount: number;
  type: 'deposit' | 'milestone' | 'final';
  onPaymentSuccess: () => void;
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  jobId, 
  jobTitle, 
  amount, 
  type,
  onPaymentSuccess 
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  if (!isOpen) return null;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: jobId,
          amount,
          type,
          payerId: 'demo-homeowner', // In real app, get from auth
          description: `${type} payment for ${jobTitle}`
        })
      });

      if (response.ok) {
        const result = await response.json();
        onPaymentSuccess();
        onClose();
        alert('Payment processed successfully! (Demo Mode)');
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentTypeInfo = () => {
    switch (type) {
      case 'deposit':
        return {
          title: 'Project Deposit',
          description: 'Secure your booking with the contractor',
          icon: <DollarSign className="h-5 w-5" />
        };
      case 'milestone':
        return {
          title: 'Milestone Payment',
          description: 'Payment for completed project milestone',
          icon: <Calendar className="h-5 w-5" />
        };
      case 'final':
        return {
          title: 'Final Payment',
          description: 'Final payment upon project completion',
          icon: <CheckCircle className="h-5 w-5" />
        };
    }
  };

  const typeInfo = getPaymentTypeInfo();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4 py-8">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                {typeInfo.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{typeInfo.title}</h2>
                <p className="text-sm text-gray-600">{typeInfo.description}</p>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Job Details</h3>
            <p className="text-sm text-gray-600 mb-2">{jobTitle}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Amount:</span>
              <span className="text-lg font-bold text-green-600">${amount.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Payment Method</h3>
            <div className="space-y-2">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-rose-600"
                />
                <CreditCard className="h-5 w-5 ml-3 text-gray-400" />
                <span className="ml-3">Credit/Debit Card</span>
              </label>
            </div>
          </div>

          {/* Demo Card Form */}
          {paymentMethod === 'card' && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Card Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cardDetails.cvc}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, cvc: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Demo Notice */}
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 mb-6">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-rose-700 mt-0.5" />
              <div>
                <p className="text-sm text-rose-900 font-medium">Demo Mode</p>
                <p className="text-xs text-rose-700">This is a demonstration. No real payment will be processed.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <Clock className="animate-spin h-4 w-4 mr-2" />
                  Processing...
                </>
              ) : (
                `Pay $${amount.toFixed(2)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}