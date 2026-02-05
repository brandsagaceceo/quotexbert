'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  quoteId: string;
  amount: number;
  projectTitle: string;
  onSuccess: (payment: any) => void;
  onError: (error: string) => void;
}

function PaymentForm({ quoteId, amount, projectTitle, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [showNewCard, setShowNewCard] = useState(false);

  // Mock user ID - in real app, get from auth
  const userId = 'user_123';

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch(`/api/payments/setup?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setPaymentMethods(data.paymentMethods);
        if (data.paymentMethods.length > 0) {
          const defaultMethod = data.paymentMethods.find((pm: any) => pm.isDefault);
          setSelectedPaymentMethod(defaultMethod?.stripePaymentMethodId || data.paymentMethods[0].stripePaymentMethodId);
        }
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      let paymentMethodId = selectedPaymentMethod;

      // If using new card, create payment method
      if (showNewCard || !paymentMethodId) {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error('Card element not found');
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

        if (error) {
          throw new Error(error.message);
        }

        paymentMethodId = paymentMethod.id;

        // Save payment method for future use
        await fetch('/api/payments/setup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            paymentMethodId,
            isDefault: paymentMethods.length === 0
          })
        });
      }

      // Process payment
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteId,
          homeownerId: userId,
          paymentMethodId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      if (data.success) {
        onSuccess(data.payment);
      }

    } catch (error) {
      console.error('Payment error:', error);
      onError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">
        Pay for: {projectTitle}
      </h3>
      
      <div className="mb-4">
        <div className="text-2xl font-bold text-green-600">
          ${amount.toLocaleString()}
        </div>
        <div className="text-sm text-gray-600">
          Secure payment processed by Stripe
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Payment Method Selection */}
        {paymentMethods.length > 0 && !showNewCard && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <select
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {paymentMethods.map((pm) => (
                <option key={pm.id} value={pm.stripePaymentMethodId}>
                  {pm.brand ? `${pm.brand.toUpperCase()} •••• ${pm.last4}` : `${pm.type} •••• ${pm.last4}`}
                  {pm.isDefault && ' (Default)'}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowNewCard(true)}
              className="mt-2 text-sm text-rose-700 hover:text-rose-900"
            >
              Use a different card
            </button>
          </div>
        )}

        {/* New Card Form */}
        {(showNewCard || paymentMethods.length === 0) && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {paymentMethods.length > 0 ? 'New Card' : 'Card Details'}
            </label>
            <div className="p-3 border border-gray-300 rounded-md">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                  },
                }}
              />
            </div>
            {paymentMethods.length > 0 && (
              <button
                type="button"
                onClick={() => setShowNewCard(false)}
                className="mt-2 text-sm text-rose-700 hover:text-rose-900"
              >
                Use saved payment method
              </button>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!stripe || processing}
          className={`w-full py-3 px-4 rounded-md font-medium ${
            processing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-rose-700 hover:bg-rose-800 text-white'
          }`}
        >
          {processing ? 'Processing...' : `Pay $${amount.toLocaleString()}`}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <div>🔒 Your payment is secured by 256-bit SSL encryption</div>
        <div className="mt-1">Funds are held in escrow until project completion</div>
      </div>
    </div>
  );
}

export default function PaymentModal({ 
  quoteId, 
  amount, 
  projectTitle, 
  onSuccess, 
  onError, 
  onClose 
}: PaymentFormProps & { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
        >
          ✕
        </button>
        <Elements stripe={stripePromise}>
          <PaymentForm
            quoteId={quoteId}
            amount={amount}
            projectTitle={projectTitle}
            onSuccess={onSuccess}
            onError={onError}
          />
        </Elements>
      </div>
    </div>
  );
}