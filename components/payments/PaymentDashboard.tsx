'use client';

import React, { useState, useEffect } from 'react';
import PaymentReleaseModal from './PaymentReleaseModal';

interface Payment {
  id: string;
  amount: number;
  contractorAmount: number;
  platformFee: number;
  stripeFee: number;
  status: string;
  projectTitle: string;
  quoteTitle: string;
  contractorName?: string;
  homeownerName?: string;
  createdAt: string;
  escrowedAt?: string;
  releasedAt?: string;
  refundedAt?: string;
}

interface PaymentSummary {
  totalPaid?: number;
  totalEarned?: number;
  totalPending?: number;
  totalPlatformFees?: number;
  totalStripeFees?: number;
  paymentsCount: number;
  escrowedPayments: number;
  releasedPayments: number;
  recentPayments: Payment[];
}

interface PaymentDashboardProps {
  userId: string;
  role: 'homeowner' | 'contractor';
}

export default function PaymentDashboard({ userId, role }: PaymentDashboardProps) {
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showReleaseModal, setShowReleaseModal] = useState(false);

  useEffect(() => {
    fetchPaymentData();
  }, [userId, role]);

  const fetchPaymentData = async () => {
    try {
      const response = await fetch(`/api/payments/dashboard?userId=${userId}&role=${role}`);
      const data = await response.json();
      
      if (data.success) {
        setSummary(data.summary);
        setPayments(data.payments);
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReleasePayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowReleaseModal(true);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      escrowed: 'bg-rose-100 text-rose-900',
      released: 'bg-green-100 text-green-800',
      refunded: 'bg-gray-100 text-gray-800',
      failed: 'bg-red-100 text-red-800'
    };

    const labels = {
      pending: 'Pending',
      escrowed: 'In Escrow',
      released: 'Released',
      refunded: 'Refunded',
      failed: 'Failed'
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles] || styles.pending}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {role === 'homeowner' ? (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Total Paid</h3>
              <p className="text-3xl font-bold text-green-600">
                ${summary?.totalPaid?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {summary?.paymentsCount || 0} payments
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">In Escrow</h3>
              <p className="text-3xl font-bold text-rose-700">
                {summary?.escrowedPayments || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Awaiting release
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Platform Fees</h3>
              <p className="text-3xl font-bold text-gray-600">
                ${summary?.totalPlatformFees?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Total fees paid
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Total Earned</h3>
              <p className="text-3xl font-bold text-green-600">
                ${summary?.totalEarned?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {summary?.releasedPayments || 0} completed projects
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Pending</h3>
              <p className="text-3xl font-bold text-rose-700">
                ${summary?.totalPending?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {summary?.escrowedPayments || 0} in escrow
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Projects</h3>
              <p className="text-3xl font-bold text-gray-600">
                {summary?.paymentsCount || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Total paid projects
              </p>
            </div>
          </>
        )}
      </div>

      {/* Payments Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {role === 'homeowner' ? 'Payment History' : 'Earnings History'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {role === 'homeowner' ? 'Contractor' : 'Homeowner'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                {role === 'homeowner' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {payment.projectTitle}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.quoteTitle}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {role === 'homeowner' ? payment.contractorName : payment.homeownerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${(role === 'homeowner' ? payment.amount : payment.contractorAmount).toLocaleString()}
                    </div>
                    {role === 'homeowner' && (
                      <div className="text-xs text-gray-500">
                        Fee: ${payment.platformFee.toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.createdAt).toLocaleDateString()}
                    {payment.releasedAt && (
                      <div className="text-xs text-green-600">
                        Released: {new Date(payment.releasedAt).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  {role === 'homeowner' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {payment.status === 'escrowed' && (
                        <button
                          onClick={() => handleReleasePayment(payment)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Release Payment
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          
          {payments.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">No payments found</div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Release Modal */}
      {showReleaseModal && selectedPayment && (
        <PaymentReleaseModal
          paymentId={selectedPayment.id}
          amount={selectedPayment.contractorAmount}
          contractorName={selectedPayment.contractorName || 'Contractor'}
          projectTitle={selectedPayment.projectTitle}
          onSuccess={() => {
            fetchPaymentData(); // Refresh data
          }}
          onError={(error) => {
            console.error('Release error:', error);
            alert('Failed to release payment: ' + error);
          }}
          onClose={() => {
            setShowReleaseModal(false);
            setSelectedPayment(null);
          }}
        />
      )}
    </div>
  );
}