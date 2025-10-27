'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface Quote {
  id: string;
  title: string;
  description: string;
  scope: string;
  laborCost: number;
  materialCost: number;
  totalCost: number;
  status: string;
  isEdited: boolean;
  aiAnalysis: string | null;
  extractedRequirements: string | null;
  confidenceScore: number;
  sentAt: string | null;
  acceptedAt: string | null;
  rejectedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  job: {
    id: string;
    title: string;
    description: string;
    budget: number;
    category: string;
  };
  items: QuoteItem[];
}

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: string;
}

export default function QuoteManagementPage() {
  const { authUser, isSignedIn } = useAuth();
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }
    if (authUser?.role !== 'contractor') {
      router.push('/');
      return;
    }
    fetchQuotes();
  }, [authUser, isSignedIn, router]);

  const fetchQuotes = async () => {
    try {
      const response = await fetch(`/api/quotes?contractorId=${authUser?.id}`);
      if (response.ok) {
        const data = await response.json();
        setQuotes(data.quotes || []);
        if (data.quotes?.length > 0 && !selectedQuote) {
          setSelectedQuote(data.quotes[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuote = async (updatedQuote: Partial<Quote>) => {
    if (!selectedQuote) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/quotes/${selectedQuote.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedQuote),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedQuote(data.quote);
        await fetchQuotes();
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating quote:', error);
    } finally {
      setSaving(false);
    }
  };

  const sendQuote = async () => {
    if (!selectedQuote) return;

    setSending(true);
    try {
      const response = await fetch(`/api/quotes/${selectedQuote.id}/send`, {
        method: 'POST',
      });

      if (response.ok) {
        await fetchQuotes();
        alert('Quote sent successfully!');
      } else {
        alert('Failed to send quote');
      }
    } catch (error) {
      console.error('Error sending quote:', error);
      alert('Error sending quote');
    } finally {
      setSending(false);
    }
  };

  const generateQuote = async (conversationId: string) => {
    try {
      const response = await fetch('/api/quotes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          contractorId: authUser?.id,
        }),
      });

      if (response.ok) {
        await fetchQuotes();
        alert('Quote generated successfully!');
      } else {
        alert('Failed to generate quote');
      }
    } catch (error) {
      console.error('Error generating quote:', error);
      alert('Error generating quote');
    }
  };

  const addItem = () => {
    if (!selectedQuote) return;
    
    const newItem: QuoteItem = {
      id: `temp-${Date.now()}`,
      description: 'New Item',
      quantity: 1,
      unitPrice: 0,
      total: 0,
      category: 'labor'
    };

    setSelectedQuote({
      ...selectedQuote,
      items: [...selectedQuote.items, newItem]
    });
  };

  const updateItem = (itemId: string, updates: Partial<QuoteItem>) => {
    if (!selectedQuote) return;

    const updatedItems = selectedQuote.items.map(item => {
      if (item.id === itemId) {
        const updated = { ...item, ...updates };
        updated.total = updated.quantity * updated.unitPrice;
        return updated;
      }
      return item;
    });

    const laborCost = updatedItems
      .filter(item => item.category === 'labor')
      .reduce((sum, item) => sum + item.total, 0);
    
    const materialCost = updatedItems
      .filter(item => item.category === 'material')
      .reduce((sum, item) => sum + item.total, 0);

    setSelectedQuote({
      ...selectedQuote,
      items: updatedItems,
      laborCost,
      materialCost,
      totalCost: laborCost + materialCost
    });
  };

  const removeItem = (itemId: string) => {
    if (!selectedQuote) return;
    
    const updatedItems = selectedQuote.items.filter(item => item.id !== itemId);
    setSelectedQuote({
      ...selectedQuote,
      items: updatedItems
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading quotes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Quote Management</h1>
          <button
            onClick={() => router.push('/messages')}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Generate New Quote from Chat
          </button>
        </div>

        {quotes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No quotes yet</h2>
            <p className="text-gray-600 mb-4">
              Start a conversation with a homeowner and use AI to generate your first quote.
            </p>
            <button
              onClick={() => router.push('/messages')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Go to Messages
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quotes List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Your Quotes</h2>
                </div>
                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {quotes.map((quote) => (
                    <div
                      key={quote.id}
                      onClick={() => setSelectedQuote(quote)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 ${
                        selectedQuote?.id === quote.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {quote.job.title}
                          </h3>
                          <p className="text-lg font-bold text-green-600">
                            ${quote.totalCost.toLocaleString()}
                          </p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            quote.status === 'SENT' ? 'bg-blue-100 text-blue-800' :
                            quote.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                            quote.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {quote.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Created: {new Date(quote.createdAt).toLocaleDateString()}
                      </p>
                      {quote.aiAnalysis && (
                        <div className="flex items-center mt-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span className="text-xs text-purple-600">AI Generated</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quote Details */}
            <div className="lg:col-span-2">
              {selectedQuote ? (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedQuote.job.title}</h2>
                        <p className="text-gray-600 mt-1">{selectedQuote.job.description}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Budget: ${selectedQuote.job.budget.toLocaleString()} | Category: {selectedQuote.job.category}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {!editing && selectedQuote.status === 'draft' && (
                          <button
                            onClick={() => setEditing(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                          >
                            Edit Quote
                          </button>
                        )}
                        {editing && (
                          <>
                            <button
                              onClick={() => setEditing(false)}
                              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => updateQuote(selectedQuote)}
                              disabled={saving}
                              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                            >
                              {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                          </>
                        )}
                        {!editing && selectedQuote.status === 'draft' && (
                          <button
                            onClick={sendQuote}
                            disabled={sending}
                            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
                          >
                            {sending ? 'Sending...' : 'Send Quote'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Quote Summary */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Quote Summary</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-blue-600 font-medium">Labor Cost</p>
                          <p className="text-2xl font-bold text-blue-900">
                            ${selectedQuote.laborCost.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm text-green-600 font-medium">Material Cost</p>
                          <p className="text-2xl font-bold text-green-900">
                            ${selectedQuote.materialCost.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="text-sm text-purple-600 font-medium">Total Cost</p>
                          <p className="text-2xl font-bold text-purple-900">
                            ${selectedQuote.totalCost.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quote Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                      {editing ? (
                        <textarea
                          value={selectedQuote.description}
                          onChange={(e) => setSelectedQuote({ ...selectedQuote, description: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                        />
                      ) : (
                        <p className="text-gray-700 p-3 bg-gray-50 rounded-md">
                          {selectedQuote.description}
                        </p>
                      )}
                    </div>

                    {/* Scope of Work */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Scope of Work</h3>
                      {editing ? (
                        <textarea
                          value={selectedQuote.scope}
                          onChange={(e) => setSelectedQuote({ ...selectedQuote, scope: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={4}
                        />
                      ) : (
                        <p className="text-gray-700 p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
                          {selectedQuote.scope}
                        </p>
                      )}
                    </div>

                    {/* Quote Items */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">Quote Items</h3>
                        {editing && (
                          <button
                            onClick={addItem}
                            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
                          >
                            Add Item
                          </button>
                        )}
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Qty
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Unit Price
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                              </th>
                              {editing && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {selectedQuote.items.map((item) => (
                              <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {editing ? (
                                    <input
                                      type="text"
                                      value={item.description}
                                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                                      className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                  ) : (
                                    <span className="text-sm text-gray-900">{item.description}</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {editing ? (
                                    <select
                                      value={item.category}
                                      onChange={(e) => updateItem(item.id, { category: e.target.value })}
                                      className="p-2 border border-gray-300 rounded-md"
                                    >
                                      <option value="labor">Labor</option>
                                      <option value="material">Material</option>
                                    </select>
                                  ) : (
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                      item.category === 'labor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                      {item.category}
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {editing ? (
                                    <input
                                      type="number"
                                      value={item.quantity}
                                      onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) })}
                                      className="w-20 p-2 border border-gray-300 rounded-md"
                                      min="1"
                                    />
                                  ) : (
                                    <span className="text-sm text-gray-900">{item.quantity}</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {editing ? (
                                    <input
                                      type="number"
                                      value={item.unitPrice}
                                      onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) })}
                                      className="w-24 p-2 border border-gray-300 rounded-md"
                                      min="0"
                                      step="0.01"
                                    />
                                  ) : (
                                    <span className="text-sm text-gray-900">${item.unitPrice.toFixed(2)}</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm font-medium text-gray-900">
                                    ${item.total.toFixed(2)}
                                  </span>
                                </td>
                                {editing && (
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                      onClick={() => removeItem(item.id)}
                                      className="text-red-600 hover:text-red-900 text-sm"
                                    >
                                      Remove
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* AI Analysis (if available) */}
                    {selectedQuote.aiAnalysis && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Analysis</h3>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="text-sm text-purple-700 mb-2">
                            <strong>Confidence Score:</strong> {(selectedQuote.confidenceScore * 100).toFixed(1)}%
                          </p>
                          <p className="text-sm text-purple-700 mb-2">
                            <strong>Analysis:</strong>
                          </p>
                          <p className="text-sm text-purple-800">{selectedQuote.aiAnalysis}</p>
                          {selectedQuote.extractedRequirements && (
                            <>
                              <p className="text-sm text-purple-700 mt-3 mb-2">
                                <strong>Extracted Requirements:</strong>
                              </p>
                              <p className="text-sm text-purple-800">{selectedQuote.extractedRequirements}</p>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Select a quote</h2>
                  <p className="text-gray-600">Choose a quote from the list to view and edit details.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}