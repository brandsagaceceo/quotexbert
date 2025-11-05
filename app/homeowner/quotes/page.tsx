'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';

interface Quote {
  id: string;
  title: string;
  description: string;
  scope: string;
  laborCost: number;
  materialCost: number;
  totalCost: number;
  status: string;
  sentAt: string | null;
  acceptedAt: string | null;
  rejectedAt: string | null;
  expiresAt: string | null;
  isEdited: boolean;
  aiAnalysis: string | null;
  confidenceScore: number;
  job: {
    id: string;
    title: string;
    description: string;
    budget: number;
    category: string;
    zipCode: string;
  };
  contractor: {
    id: string;
    name: string;
    email: string;
    contractorProfile?: {
      companyName: string;
      trade: string;
      city: string;
    };
  };
  items: QuoteItem[];
  conversation: {
    id: string;
    status: string;
  };
}

interface QuoteItem {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export default function HomeownerQuotesPage() {
  const { authUser, isSignedIn } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (authUser && isSignedIn && authUser.role === 'homeowner') {
      fetchQuotes();
    }
  }, [authUser, isSignedIn]);

  const fetchQuotes = async () => {
    try {
      const response = await fetch(`/api/homeowner/quotes?homeownerId=${authUser?.id}`);
      if (response.ok) {
        const data = await response.json();
        setQuotes(data);
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuoteAction = async (quoteId: string, action: 'accept' | 'reject') => {
    if (!authUser) return;

    setProcessing(true);
    try {
      const response = await fetch(`/api/homeowner/quotes/${quoteId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          homeownerId: authUser.id
        })
      });

      if (response.ok) {
        await fetchQuotes(); // Refresh the quotes list
        setSelectedQuote(null); // Close the modal
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to process quote');
      }
    } catch (error) {
      console.error('Error processing quote:', error);
      alert('Failed to process quote');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles] || styles.draft}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isSignedIn || authUser?.role !== 'homeowner') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">This page is only accessible to homeowners.</p>
          <Link href="/sign-in" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div>Loading quotes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Quotes</h1>
          <p className="text-gray-600 mt-2">
            Review and manage quotes you've received from contractors
          </p>
        </div>

        {quotes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No quotes yet</h2>
            <p className="text-gray-600 mb-4">
              Quotes will appear here when contractors send you estimates for your projects.
            </p>
            <Link
              href="/create-lead"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Post a Project
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {quotes.map((quote) => (
              <div key={quote.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {quote.title}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        For: <span className="font-medium">{quote.job.title}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        From: {quote.contractor.contractorProfile?.companyName || quote.contractor.name} 
                        ({quote.contractor.contractorProfile?.city})
                      </p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(quote.status)}
                      <div className="mt-2">
                        <span className="text-2xl font-bold text-gray-900">
                          ${quote.totalCost.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-700 mb-4">{quote.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Labor Cost:</span>
                        <span className="ml-2 text-gray-900">${quote.laborCost.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Materials:</span>
                        <span className="ml-2 text-gray-900">${quote.materialCost.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Sent:</span>
                        <span className="ml-2 text-gray-900">{formatDate(quote.sentAt)}</span>
                      </div>
                      {quote.expiresAt && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Expires:</span>
                          <span className="ml-2 text-gray-900">{formatDate(quote.expiresAt)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => setSelectedQuote(quote)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Details
                      </button>
                      
                      {quote.status === 'sent' && (
                        <div className="space-x-3">
                          <button
                            onClick={() => handleQuoteAction(quote.id, 'reject')}
                            disabled={processing}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleQuoteAction(quote.id, 'accept')}
                            disabled={processing}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                          >
                            Accept Quote
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quote Details Modal */}
        {selectedQuote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Quote Details
                  </h2>
                  <button
                    onClick={() => setSelectedQuote(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Information</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-gray-700">Project:</span>
                        <span className="ml-2">{selectedQuote.job.title}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Category:</span>
                        <span className="ml-2 capitalize">{selectedQuote.job.category}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Your Budget:</span>
                        <span className="ml-2">${selectedQuote.job.budget.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Location:</span>
                        <span className="ml-2">{selectedQuote.job.zipCode}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Contractor Information</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-gray-700">Company:</span>
                        <span className="ml-2">{selectedQuote.contractor.contractorProfile?.companyName || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Specialization:</span>
                        <span className="ml-2 capitalize">{selectedQuote.contractor.contractorProfile?.trade || 'General'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Location:</span>
                        <span className="ml-2">{selectedQuote.contractor.contractorProfile?.city || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Contact:</span>
                        <span className="ml-2">{selectedQuote.contractor.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Quote Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">{selectedQuote.title}</h4>
                    <p className="text-gray-700 mb-3">{selectedQuote.description}</p>
                    
                    <div className="border-t border-gray-200 pt-3">
                      <h5 className="font-medium text-gray-900 mb-2">Scope of Work</h5>
                      <p className="text-gray-700 whitespace-pre-line">{selectedQuote.scope}</p>
                    </div>
                  </div>
                </div>

                {selectedQuote.items.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full table-auto">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 font-medium text-gray-900">Item</th>
                            <th className="text-left py-2 font-medium text-gray-900">Category</th>
                            <th className="text-center py-2 font-medium text-gray-900">Qty</th>
                            <th className="text-right py-2 font-medium text-gray-900">Unit Price</th>
                            <th className="text-right py-2 font-medium text-gray-900">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedQuote.items.map((item) => (
                            <tr key={item.id} className="border-b border-gray-100">
                              <td className="py-2 pr-4">
                                <div>
                                  <div className="font-medium text-gray-900">{item.description}</div>
                                  {item.notes && (
                                    <div className="text-sm text-gray-500">{item.notes}</div>
                                  )}
                                </div>
                              </td>
                              <td className="py-2 pr-4 capitalize text-gray-700">{item.category}</td>
                              <td className="py-2 pr-4 text-center text-gray-700">{item.quantity}</td>
                              <td className="py-2 pr-4 text-right text-gray-700">${item.unitPrice.toLocaleString()}</td>
                              <td className="py-2 text-right font-medium text-gray-900">${item.totalPrice.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t-2 border-gray-300">
                            <td colSpan={4} className="py-2 pr-4 text-right font-semibold text-gray-900">
                              Total Cost:
                            </td>
                            <td className="py-2 text-right text-xl font-bold text-gray-900">
                              ${selectedQuote.totalCost.toLocaleString()}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}

                {selectedQuote.aiAnalysis && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Analysis</h3>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-line">{selectedQuote.aiAnalysis}</p>
                      <div className="mt-2 text-sm text-gray-600">
                        Confidence Score: {Math.round(selectedQuote.confidenceScore * 100)}%
                      </div>
                    </div>
                  </div>
                )}

                {selectedQuote.status === 'sent' && (
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleQuoteAction(selectedQuote.id, 'reject')}
                      disabled={processing}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      {processing ? 'Processing...' : 'Reject Quote'}
                    </button>
                    <button
                      onClick={() => handleQuoteAction(selectedQuote.id, 'accept')}
                      disabled={processing}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {processing ? 'Processing...' : 'Accept Quote'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}